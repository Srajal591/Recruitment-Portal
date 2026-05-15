const Employee = require("../../packages/common/models/Employee");
const Role = require("../../packages/common/models/Role");
const ApiError = require("../../packages/common/utils/ApiError");
const { getPaginationParams, generateEmployeeId } = require("../../packages/common/utils/helpers");
const { paginationMeta } = require("../../packages/common/utils/ApiResponse");
const { publishToQueue, QUEUES } = require("../../packages/config/rabbitmq");

const createEmployee = async (data) => {
  const existing = await Employee.findOne({
    officialEmail: data.officialEmail,
  });
  if (existing) throw new ApiError(409, "Email already registered");

  if (data.roleId) {
    const role = await Role.findById(data.roleId);
    if (!role) throw new ApiError(404, "Role not found");
  }

  const employeeId = generateEmployeeId();
  const employee = await Employee.create({
    ...data,
    employeeId,
    role: "employee",
  });

  // Send welcome email with temp password
  await publishToQueue(QUEUES.EMAIL, {
    type: "employee_welcome",
    to: data.officialEmail,
    name: data.fullName,
    employeeId,
    tempPassword: data.password,
  });

  return employee.toSafeObject();
};

const getEmployees = async (query) => {
  const { page, limit, skip } = getPaginationParams(query);
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.department) filter.department = new RegExp(query.department, "i");
  if (query.role) filter.role = query.role;

  const [employees, total] = await Promise.all([
    Employee.find(filter)
      .populate("roleId", "roleName")
      .select("-password -refreshToken")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Employee.countDocuments(filter),
  ]);

  return { employees, meta: paginationMeta(total, page, limit) };
};

const getEmployeeById = async (id) => {
  const employee = await Employee.findById(id)
    .populate("roleId", "roleName permissions")
    .select("-password -refreshToken");
  if (!employee) throw new ApiError(404, "Employee not found");
  return employee;
};

const updateEmployee = async (id, data) => {
  // Prevent password update through this route
  delete data.password;
  const employee = await Employee.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).select("-password -refreshToken");
  if (!employee) throw new ApiError(404, "Employee not found");
  return employee;
};

const deleteEmployee = async (id) => {
  const employee = await Employee.findByIdAndDelete(id);
  if (!employee) throw new ApiError(404, "Employee not found");
  return { message: "Employee deleted successfully" };
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};

