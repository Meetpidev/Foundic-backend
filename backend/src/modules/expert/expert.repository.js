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

async function getDashboardData(userId) {
  const profile = await prisma.expertProfile.findUnique({ where: { userId } });
  if (!profile) return { profile: null, matches: [], projects: [] };

  const matches = await prisma.expertMatch.findMany({
    where: { expertId: profile.id, status: "suggested" },
    include: { problem: true },
    orderBy: { matchScore: "desc" },
  });

  const projects = await prisma.project.findMany({
    where: { expertId: profile.id },
    include: { tasks: true, milestones: true },
  });

  return { profile, matches, projects };
}

module.exports = { getProfileByUserId, updateProfile, updateStatus, getOpportunities, getDashboardData };