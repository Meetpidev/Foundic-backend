const prisma = require("../../config/db");

function getProblemById(problemId) {
  return prisma.problem.findUnique({ where: { id: problemId } });
}

function getApprovedExperts() {
  return prisma.expertProfile.findMany({ where: { status: "APPROVED" } });
}

function saveMatches(matches) {
  // matches: [{ problemId, expertId, matchScore, factors }]
  return prisma.$transaction(
    matches.map((m) =>
      prisma.expertMatch.create({
        data: {
          problemId: m.problemId,
          expertId: m.expertId,
          matchScore: m.matchScore,
          factors: m.factors,
        },
      })
    )
  );
}

function getMatchesForProblem(problemId) {
  return prisma.expertMatch.findMany({
    where: { problemId },
    include: { expert: true },
    orderBy: { matchScore: "desc" },
  });
}

function updateMatchStatus(matchId, status) {
  return prisma.expertMatch.update({ where: { id: matchId }, data: { status } });
}

module.exports = {
  getProblemById,
  getApprovedExperts,
  saveMatches,
  getMatchesForProblem,
  updateMatchStatus,
};