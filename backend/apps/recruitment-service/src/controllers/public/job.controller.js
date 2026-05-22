const { StatusCodes } = require("http-status-codes");
const Job = require("../../shared/models/Job");
const Project = require("../../shared/models/Project");
const Application = require("../../shared/models/Application");
const ApiError = require("../../shared/utils/ApiError");
const { ApiResponse } = require("../../shared/utils/ApiResponse");
const asyncHandler = require("../../shared/utils/asyncHandler");

/**
 * @desc    Get all active jobs (public)
 * @route   GET /api/jobs
 * @access  Public
 */
const getJobs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    department,
    category,
    state,
    search,
    sortBy = "publishedAt",
    sortOrder = "desc",
  } = req.query;

  // Build filter - only show active jobs
  const filter = { status: "active" };

  if (department) filter.department = new RegExp(department, "i");
  if (category) filter.category = category;

  // Filter by project state if specified
  if (state) {
    const projects = await Project.find({
      state: new RegExp(state, "i"),
    }).distinct("_id");
    filter.projectId = { $in: projects };
  }

  if (search) {
    filter.$or = [
      { title: new RegExp(search, "i") },
      { description: new RegExp(search, "i") },
      { department: new RegExp(search, "i") },
    ];
  }

  // Only show jobs with future application deadlines
  filter.applicationDeadline = { $gte: new Date() };

  // Build sort
  const sort = {};
  sort[sortBy] = sortOrder === "desc" ? -1 : 1;

  // Execute query with pagination
  const skip = (page - 1) * limit;
  const jobs = await Job.find(filter)
    .populate("projectId", "name department state")
    .select(
      "title postCode department category totalPosts posts salaryRange applicationDeadline examDate workLocation publishedAt applicationFee",
    )
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Job.countDocuments(filter);

  // Get application counts for each job
  const jobsWithStats = await Promise.all(
    jobs.map(async (job) => {
      const applicationCount = await Application.countDocuments({
        jobId: job._id,
        status: { $ne: "draft" },
      });

      return {
        ...job.toObject(),
        totalApplicants: applicationCount,
        daysLeft: job.applicationDeadline
          ? Math.ceil(
              (job.applicationDeadline - new Date()) / (1000 * 60 * 60 * 24),
            )
          : null,
      };
    }),
  );

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "Jobs fetched successfully", {
      jobs: jobsWithStats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    }),
  );
});

/**
 * @desc    Get single job details (public)
 * @route   GET /api/jobs/:id
 * @access  Public
 */
const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findOne({
    _id: req.params.id,
    status: "active",
  }).populate("projectId", "name department state description");

  if (!job) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Job not found or not available");
  }

  // Get application statistics
  const totalApplicants = await Application.countDocuments({
    jobId: job._id,
    status: { $ne: "draft" },
  });

  const categoryWiseApplicants = await Application.aggregate([
    {
      $match: {
        jobId: job._id,
        status: { $ne: "draft" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "candidateId",
        foreignField: "_id",
        as: "candidate",
      },
    },
    { $unwind: "$candidate" },
    {
      $group: {
        _id: "$candidate.category",
        count: { $sum: 1 },
      },
    },
  ]);

  const jobWithStats = {
    ...job.toObject(),
    totalApplicants,
    categoryWiseApplicants,
    daysLeft: Math.ceil(
      (job.applicationDeadline - new Date()) / (1000 * 60 * 60 * 24),
    ),
    isApplicationOpen: job.applicationDeadline > new Date(),
  };

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "Job details fetched successfully", {
      job: jobWithStats,
    }),
  );
});

/**
 * @desc    Get job statistics for homepage
 * @route   GET /api/jobs/stats
 * @access  Public
 */
const getJobStats = asyncHandler(async (req, res) => {
  const totalActiveJobs = await Job.countDocuments({ status: "active" });

  const totalVacancies = await Job.aggregate([
    { $match: { status: "active" } },
    { $group: { _id: null, total: { $sum: "$totalPosts" } } },
  ]);

  const departmentStats = await Job.aggregate([
    { $match: { status: "active" } },
    {
      $group: {
        _id: "$department",
        jobCount: { $sum: 1 },
        totalPosts: { $sum: "$totalPosts" },
      },
    },
    { $sort: { jobCount: -1 } },
    { $limit: 10 },
  ]);

  const upcomingDeadlines = await Job.find({
    status: "active",
    applicationDeadline: {
      $gte: new Date(),
      $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next 7 days
    },
  })
    .select("title department applicationDeadline")
    .sort({ applicationDeadline: 1 })
    .limit(5);

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "Job statistics fetched successfully", {
      totalActiveJobs,
      totalVacancies: totalVacancies[0]?.total || 0,
      departmentStats,
      upcomingDeadlines,
    }),
  );
});

/**
 * @desc    Search jobs with filters (for homepage search)
 * @route   GET /api/jobs/search
 * @access  Public
 */
const searchJobs = asyncHandler(async (req, res) => {
  const { q, department, category, qualification, experience } = req.query;

  const filter = {
    status: "active",
    applicationDeadline: { $gte: new Date() },
  };

  if (q) {
    filter.$or = [
      { title: new RegExp(q, "i") },
      { description: new RegExp(q, "i") },
      { department: new RegExp(q, "i") },
    ];
  }

  if (department) filter.department = new RegExp(department, "i");
  if (category) filter.category = category;

  // Filter by education qualification
  if (qualification) {
    filter["education.essential.degree"] = new RegExp(qualification, "i");
  }

  // Filter by experience requirement
  if (experience) {
    if (experience === "fresher") {
      filter["experience.required"] = false;
    } else {
      filter["experience.required"] = true;
      filter["experience.years"] = { $lte: parseInt(experience) };
    }
  }

  const jobs = await Job.find(filter)
    .populate("projectId", "name state")
    .select(
      "title postCode department category totalPosts applicationDeadline workLocation",
    )
    .sort({ applicationDeadline: 1 })
    .limit(20);

  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, "Jobs found", { jobs }));
});

/**
 * @desc    Get departments list
 * @route   GET /api/jobs/departments
 * @access  Public
 */
const getDepartments = asyncHandler(async (req, res) => {
  const departments = await Job.distinct("department", { status: "active" });

  res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, "Departments fetched", {
        departments: departments.sort(),
      }),
    );
});

/**
 * @desc    Get categories list
 * @route   GET /api/jobs/categories
 * @access  Public
 */
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Job.distinct("category", { status: "active" });

  res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, "Categories fetched", {
        categories: categories.sort(),
      }),
    );
});

module.exports = {
  getJobs,
  getJob,
  getJobStats,
  searchJobs,
  getDepartments,
  getCategories,
};
