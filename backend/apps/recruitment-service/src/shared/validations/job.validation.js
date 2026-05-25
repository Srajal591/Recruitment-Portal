const { z } = require("zod");

const jobPostSchema = z.object({
  _id: z.string().optional(),
  postCode: z.string().max(50).optional().default(""),
  title: z.string().min(2, "Post title is required").max(200),
  designation: z.string().min(2, "Designation is required").max(200),
  department: z.string().max(200).optional().default(""),
  category: z.string().max(100).optional().default(""),
  vacancies: z.number().int().min(1, "Vacancies must be at least 1"),
  payLevel: z.string().max(100).optional().default(""),
  location: z.string().max(200).optional().default(""),
  status: z.enum(["active", "inactive"]).optional().default("active"),
});

const createJobSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  title: z.string().min(3, "Job title must be at least 3 characters").max(200),
  postCode: z.string().min(2, "Post code is required").max(50),
  department: z.string().min(2, "Department is required"),
  category: z
    .enum(["General", "Technical", "Administrative", "Teaching"])
    .optional(),
  jobType: z.enum(["Permanent", "Contract", "Temporary"]).optional(),
  workLocation: z.string().optional(),
  description: z.string().max(5000).optional(),
  totalPosts: z.number().int().min(1).optional(),
  posts: z.array(jobPostSchema).optional(),
  reservedPosts: z
    .object({
      sc: z.number().int().min(0).optional(),
      st: z.number().int().min(0).optional(),
      obc: z.number().int().min(0).optional(),
      ews: z.number().int().min(0).optional(),
      pwd: z.number().int().min(0).optional(),
    })
    .optional(),
  salaryRange: z
    .object({
      min: z.number().min(0).optional(),
      max: z.number().min(0).optional(),
    })
    .optional(),
  applicationFee: z
    .object({
      general: z.number().min(0).optional(),
      obc: z.number().min(0).optional(),
      scSt: z.number().min(0).optional(),
      ews: z.number().min(0).optional(),
      pwd: z.number().min(0).optional(),
    })
    .optional(),
  applicationStartDate: z.string().optional(),
  applicationDeadline: z.string().optional(),
  examDate: z.string().optional(),
});

const updateJobSchema = createJobSchema.partial();

module.exports = { createJobSchema, updateJobSchema };
