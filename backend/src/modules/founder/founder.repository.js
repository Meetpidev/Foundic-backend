const prisma = require("../../config/db");

function getFounderProfileByUserId(userId) {
  return prisma.founderProfile.findUnique({ where: { userId } });
}

function updateHealthScore(founderId, score) {
  return prisma.founderProfile.update({
    where: { id: founderId },
    data: { businessHealthScore: score },
  });
}

function getActiveProblems(founderId) {
  return prisma.problem.findMany({
    where: { founderId, status: { in: ["DRAFT", "AI_REVIEW", "FOUNDIC_REVIEW"] } },
    orderBy: { createdAt: "desc" },
  });
}

function getActiveProjects(founderId) {
  return prisma.project.findMany({
    where: { proposal: { problem: { founderId } }, status: "ACTIVE" },
    include: { tasks: true, milestones: true },
  });
}

function createProblem(founderId, { title, description, category }) {
  return prisma.problem.create({
    data: { founderId, title, description, category, status: "AI_REVIEW" },
  });
}

function getProblemById(id) {
  return prisma.problem.findUnique({
    where: { id },
    include: { diagnosis: true, matches: true },
  });
}

module.exports = {
  getFounderProfileByUserId,
  updateHealthScore,
  getActiveProblems,
  getActiveProjects,
  createProblem,
  getProblemById,
};