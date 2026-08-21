const ApiError = require("../../utils/ApiError");
const repo = require("./matching.repository");

function scoreExpert(problem, expert) {
  let score = 0;
  const factors = {};

  const industryMatch = expert.industries?.includes(problem.category) ? 1 : 0;
  factors.industryMatch = industryMatch;
  score += industryMatch * 40;

  const skillOverlap = (expert.skills || []).length > 0 ? 1 : 0;
  factors.skillOverlap = skillOverlap;
  score += skillOverlap * 30;

  const availability = expert.status === "APPROVED" ? 1 : 0;
  factors.availability = availability;
  score += availability * 20;

  const experienceBonus = Math.min((expert.experienceYears || 0) / 10, 1);
  factors.experienceBonus = experienceBonus;
  score += experienceBonus * 10;

  return { score, factors };
}

async function runMatching(problemId) {
  const problem = await repo.getProblemById(problemId);
  if (!problem) throw new ApiError(404, "Problem not found");

  const candidateExperts = await repo.getApprovedExperts();

  const results = candidateExperts.map((expert) => {
    const { score, factors } = scoreExpert(problem, expert);
    return { problemId, expertId: expert.id, matchScore: score, factors };
  });

  results.sort((a, b) => b.matchScore - a.matchScore);
  const top = results.slice(0, 5);

  await repo.saveMatches(top);

  return top;
}

async function getMatches(problemId) {
  return repo.getMatchesForProblem(problemId);
}

module.exports = { runMatching, getMatches };