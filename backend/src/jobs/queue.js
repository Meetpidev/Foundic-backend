const { Queue, Worker } = require("bullmq");
const redisConnection = require("../config/redis");
const prisma = require("../config/db");

const diagnosisQueue = new Queue("ai-diagnosis", { connection: redisConnection });

// Worker: runs AI diagnosis on newly created problems
new Worker(
  "ai-diagnosis",
  async (job) => {
    const { problemId } = job.data;

    // Placeholder for actual LLM call via an AI service wrapper
    const diagnosis = {
      rootCause: "Sales process lacks consistent lead qualification",
      priority: "High",
      difficultyLevel: "Medium",
      suggestedCategories: ["Sales Expert", "Marketing Expert"],
      estimatedTimeline: "6-8 weeks",
      confidenceScore: 0.82,
    };

    await prisma.problemDiagnosis.create({
      data: { problemId, ...diagnosis },
    });

    await prisma.problem.update({
      where: { id: problemId },
      data: { status: "FOUNDIC_REVIEW" },
    });
  },
  { connection: redisConnection }
);

module.exports = { diagnosisQueue };