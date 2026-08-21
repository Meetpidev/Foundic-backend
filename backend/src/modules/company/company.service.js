// src/modules/company/company.service.js
const ApiError = require("../../utils/ApiError");
const repo = require("./company.repository");

async function getProfile(userId) {
  const profile = await repo.getProfileByUserId(userId);
  if (!profile) throw new ApiError(404, "Company profile not found");
  return profile;
}

async function updateProfile(userId, data) {
  return repo.updateProfile(userId, data);
}

async function getProjects(userId) {
  const profile = await repo.getProfileByUserId(userId);
  if (!profile) throw new ApiError(404, "Company profile not found");
  return repo.getProjects(profile.id);
}

module.exports = { getProfile, updateProfile, getProjects };