const prisma = require("../../config/db");

function getProfileByUserId(userId) {
  return prisma.companyProfile.findUnique({ where: { userId } });
}

function updateProfile(userId, data) {
  return prisma.companyProfile.update({ where: { userId }, data });
}

function getProjects(companyId) {
  return prisma.project.findMany({
    where: { companyId },
    include: { tasks: true, invoices: true, milestones: true },
    orderBy: { createdAt: "desc" },
  });
}

module.exports = { getProfileByUserId, updateProfile, getProjects };