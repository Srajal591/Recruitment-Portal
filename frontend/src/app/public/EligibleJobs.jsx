import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  ChevronDown,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  ArrowRight,
  AlertCircle,
  Loader,
} from "lucide-react";

import PublicLayout from "../../components/layouts/PublicLayout";
import { jobService } from "../../services/job.service";
import { getStoredUser } from "../../services/auth.service";

const EligibleJobs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get filter criteria from Home page or use defaults
  const initialFilters = location.state || {};

  // ── Filter State ──────────────────────────────────────────
  const [filters, setFilters] = useState({
    qualification: initialFilters.qualification || "",
    age: initialFilters.age || "",
    category: initialFilters.category || "general",
    department: "",
    search: "",
    page: 1,
    limit: 12,
  });

  const [showFilters, setShowFilters] = useState(false);

  // ── Fetch eligible jobs ───────────────────────────────────
  const {
    data: jobsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["eligible-jobs", filters],
    queryFn: () =>
      jobService.getEligibleJobs({
        q: filters.search || undefined,
        qualification: filters.qualification || undefined,
        age: filters.age ? String(filters.age) : undefined,
        candidateCategory: filters.category,
        department: filters.department || undefined,
        page: filters.page,
        limit: filters.limit,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true,
  });

  // ── Fetch departments for filter dropdown ─────────────────
  const { data: departmentsData } = useQuery({
    queryKey: ["departments"],
    queryFn: () => jobService.getDepartments(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  const jobs = jobsData?.jobs || [];
  const pagination = jobsData?.pagination || {};
  const departments = departmentsData?.departments || [];

  // ── Handlers ──────────────────────────────────────────────
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page on filter change
    }));
  };

  const handleSearch = (value) => {
    handleFilterChange("search", value);
  };

  const handleApplyNow = (jobId) => {
    const user = getStoredUser();
    if (user && user.role === "candidate") {
      navigate(`/candidate/jobs/${jobId}`);
    } else {
      navigate("/auth/candidate-login", {
        state: { jobId, redirectTo: `/candidate/jobs/${jobId}` },
      });
    }
  };

  const handleViewDetails = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetFilters = () => {
    setFilters({
      qualification: "",
      age: "",
      category: "general",
      department: "",
      search: "",
      page: 1,
      limit: 12,
    });
  };

  // ── Computed values ───────────────────────────────────────
  const hasActiveFilters = useMemo(() => {
    return (
      filters.qualification ||
      filters.age ||
      filters.category !== "general" ||
      filters.department ||
      filters.search
    );
  }, [filters]);

  const totalPages = pagination.totalPages || 1;
  const currentPage = pagination.currentPage || 1;

  // ── Animations ────────────────────────────────────────────
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ── Header ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Eligible Jobs for You
            </h1>
            <p className="text-lg text-gray-600">
              {jobs.length > 0
                ? `Found ${pagination.totalItems} job${pagination.totalItems !== 1 ? "s" : ""} matching your criteria`
                : "No jobs found matching your criteria"}
            </p>
          </motion.div>

          {/* ── Filter Section ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-white rounded-lg shadow-md p-6"
          >
            {/* Filter Toggle Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden w-full flex items-center justify-between bg-primary text-white px-4 py-2 rounded-lg mb-4"
            >
              <span className="flex items-center gap-2">
                <Filter size={18} />
                Filters
              </span>
              <ChevronDown
                size={18}
                className={`transform transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Filters Grid */}
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 ${
                !showFilters ? "hidden md:grid" : ""
              }`}
            >
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Job title, code..."
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              {/* Qualification */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualification
                </label>
                <select
                  value={filters.qualification}
                  onChange={(e) =>
                    handleFilterChange("qualification", e.target.value)
                  }
                  className="admin-select"
                >
                  <option value="">All Levels</option>
                  <option value="10th">10th Pass</option>
                  <option value="12th">12th Pass</option>
                  <option value="Graduation">Graduation</option>
                  <option value="Post Graduation">Post Graduation</option>
                </select>
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  placeholder="Your age"
                  value={filters.age}
                  onChange={(e) => handleFilterChange("age", e.target.value)}
                  min="18"
                  max="65"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="admin-select"
                >
                  <option value="general">General</option>
                  <option value="obc">OBC</option>
                  <option value="sc">SC</option>
                  <option value="st">ST</option>
                  <option value="ews">EWS</option>
                  <option value="pwd">PWD</option>
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  value={filters.department}
                  onChange={(e) =>
                    handleFilterChange("department", e.target.value)
                  }
                  className="admin-select"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition"
              >
                Reset Filters
              </motion.button>
            )}
          </motion.div>

          {/* ── Loading State ──────────────────────────────────── */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader size={48} className="text-primary animate-spin mb-4" />
              <p className="text-gray-600">Loading eligible jobs...</p>
            </div>
          )}

          {/* ── Error State ────────────────────────────────────── */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4"
            >
              <AlertCircle size={24} className="text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">
                  Error Loading Jobs
                </h3>
                <p className="text-red-700">
                  {error.message ||
                    "Failed to load eligible jobs. Please try again."}
                </p>
              </div>
            </motion.div>
          )}

          {/* ── Empty State ────────────────────────────────────── */}
          {!isLoading && !error && jobs.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-12 text-center"
            >
              <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Jobs Found
              </h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any jobs matching your criteria. Try adjusting
                your filters or check back later.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
              >
                Clear Filters
              </button>
            </motion.div>
          )}

          {/* ── Jobs Grid ──────────────────────────────────────── */}
          {!isLoading && !error && jobs.length > 0 && (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              >
                {jobs.map((job) => (
                  <motion.div
                    key={job._id}
                    variants={itemVariants}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group"
                  >
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-primary to-primary-dark p-4 text-white">
                      <h3 className="text-lg font-bold mb-1 group-hover:underline">
                        {job.title}
                      </h3>
                      <p className="text-sm opacity-90">{job.postCode}</p>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 space-y-3">
                      {/* Department & Category */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          <strong>Dept:</strong> {job.department}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {job.category}
                        </span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin
                          size={16}
                          className="text-primary flex-shrink-0"
                        />
                        <span className="text-sm">
                          {job.workLocation || "Not specified"}
                        </span>
                      </div>

                      {/* Vacancies */}
                      <div className="flex items-center gap-2 text-gray-700">
                        <Users
                          size={16}
                          className="text-primary flex-shrink-0"
                        />
                        <span className="text-sm">
                          <strong>{job.totalPosts}</strong> Vacancies
                        </span>
                      </div>

                      {/* Salary */}
                      {job.salaryRange?.min && job.salaryRange?.max && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <DollarSign
                            size={16}
                            className="text-primary flex-shrink-0"
                          />
                          <span className="text-sm">
                            ₹{job.salaryRange.min.toLocaleString()} - ₹
                            {job.salaryRange.max.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {/* Application Fee */}
                      <div className="flex items-center gap-2 text-gray-700">
                        <DollarSign
                          size={16}
                          className="text-primary flex-shrink-0"
                        />
                        <span className="text-sm">
                          Fee: ₹{job.applicableFee || 0}
                        </span>
                      </div>

                      {/* Deadline */}
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar
                          size={16}
                          className="text-primary flex-shrink-0"
                        />
                        <span className="text-sm">
                          {job.daysLeft !== null ? (
                            <>
                              <strong>{job.daysLeft}</strong> days left
                            </>
                          ) : (
                            "Deadline passed"
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="bg-gray-50 px-4 py-3 flex gap-2">
                      <button
                        onClick={() => handleViewDetails(job._id)}
                        className="flex-1 px-3 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition text-sm font-medium flex items-center justify-center gap-2"
                      >
                        Details
                        <ArrowRight size={14} />
                      </button>
                      <button
                        onClick={() => handleApplyNow(job._id)}
                        disabled={job.daysLeft <= 0}
                        className="flex-1 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Apply Now
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* ── Pagination ─────────────────────────────────── */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-2 mb-8"
                >
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg transition ${
                          page === currentPage
                            ? "bg-primary text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Next
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default EligibleJobs;
