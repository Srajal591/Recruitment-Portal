const Role = require("../models/Role");
const ApiError = require("../utils/ApiError");

const createRole = async (data, createdBy) => {
  const existing = await Role.findOne({ roleName: data.roleName });
  if (existing) throw new ApiError(409, "Role name already exists");
  return Role.create({ ...data, createdBy });
};

const getRoles = async () => {
  return Role.find({ isSystemRole: false })
    .populate("createdBy", "fullName employeeId")
    .sort({ createdAt: -1 });
};

const getRoleById = async (id) => {
  const role = await Role.findById(id);
  if (!role) throw new ApiError(404, "Role not found");
  return role;
};

const updateRole = async (id, data) => {
  const role = await Role.findById(id);
  if (!role) throw new ApiError(404, "Role not found");
  if (role.isSystemRole) throw new ApiError(403, "Cannot modify system roles");
  return Role.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const deleteRole = async (id) => {
  const role = await Role.findById(id);
  if (!role) throw new ApiError(404, "Role not found");
  if (role.isSystemRole) throw new ApiError(403, "Cannot delete system roles");
  await Role.findByIdAndDelete(id);
  return { message: "Role deleted successfully" };
};

module.exports = { createRole, getRoles, getRoleById, updateRole, deleteRole };

