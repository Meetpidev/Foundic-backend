const ApiError = require("../../utils/ApiError");
const repo = require("./expert.repository");

const STATUS_FLOW = {
  PENDING: ["AI_REVIEWED", "REJECTED"],
  AI_REVIEWED: ["MANUAL_REVIEW", "REJECTED"],
  MANUAL_REVIEW: ["INTERVIEW", "REJECTED"],
  INTERVIEW: ["TRIAL", "REJECTED"],
  TRIAL: ["APPROVED", "REJECTED"],
};

async function registerProfile(userId, data) {
  return repo.updateProfile(userId, { ...data, status: "PENDING" });
}

async function transitionStatus(expertId, currentStatus, nextStatus) {
  const allowed = STATUS_FLOW[currentStatus] || [];
  if (!allowed.includes(nextStatus)) {
    throw new ApiError(400, `Cannot move expert from ${currentStatus} to ${nextStatus}`);
  }
  return repo.updateStatus(expertId, nextStatus);
}

async function getOpportunities(userId) {
  const profile = await repo.getProfileByUserId(userId);
  if (!profile) throw new ApiError(404, "Expert profile not found");
  return repo.getOpportunities(profile.id);
}

module.exports = { registerProfile, transitionStatus, getOpportunities };