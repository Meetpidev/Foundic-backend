const ApiError = require("../../utils/ApiError");
const repo = require("./founder.repository");
const { diagnosisQueue } = require("../../jobs/queue");

// Weighted Business Health Check
function computeHealthScore(answers) {
  const weights = { sales: 0.25, revenue: 0.25, marketing: 0.15, hiring: 0.1, team: 0.15, operations: 0.1 };
  let score = 0;
  for (const key of Object.keys(weights)) {
    const value = answers[key] ?? 0; // expects 0-100 per category
    score += value * weights[key];
  }
  return Math.round(score);
}

async function runHealthCheck(userId, answers) {
  const profile = await repo.getFounderProfileByUserId(userId);
  if (!profile) throw new ApiError(404, "Founder profile not found");

  const score = computeHealthScore(answers);
  await repo.updateHealthScore(profile.id, score);

  return { businessHealthScore: score };
}

async function getDashboard(userId) {
  const profile = await repo.getFounderProfileByUserId(userId);
  if (!profile) throw new ApiError(404, "Founder profile not found");

  const [activeProblems, activeProjects] = await Promise.all([
    repo.getActiveProblems(profile.id),
    repo.getActiveProjects(profile.id),
  ]);

  return {
    businessHealthScore: profile.businessHealthScore,
    activeProblems,
    activeProjects,
  };
}

async function createProblem(userId, payload) {
  const profile = await repo.getFounderProfileByUserId(userId);
  if (!profile) throw new ApiError(404, "Founder profile not found");

  const problem = await repo.createProblem(profile.id, payload);

  // Enqueue async AI diagnosis — never block the request on LLM latency
  await diagnosisQueue.add("diagnose-problem", { problemId: problem.id });

  return problem;
}

async function getProblem(problemId) {
  const problem = await repo.getProblemById(problemId);
  if (!problem) throw new ApiError(404, "Problem not found");
  return problem;
}

module.exports = { runHealthCheck, getDashboard, createProblem, getProblem };