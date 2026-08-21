// src/modules/expert/expert.repository.js
const prisma = require("../../config/db");

function getProfileByUserId(userId) {
  return prisma.expertProfile.findUnique({ where: { userId } });
}

function updateProfile(userId, data) {
  return prisma.expertProfile.update({ where: { userId }, data });
}

function updateStatus(expertId, status) {
  return prisma.expertProfile.update({ where: { id: expertId }, data: { status } });
}

function getOpportunities(expertId) {
  return prisma.expertMatch.findMany({
    where: { expertId, status: "suggested" },
    include: { problem: true },
    orderBy: { matchScore: "desc" },
  });
}

module.exports = { getProfileByUserId, updateProfile, updateStatus, getOpportunities };