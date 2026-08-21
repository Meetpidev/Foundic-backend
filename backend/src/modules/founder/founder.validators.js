const { z } = require("zod");

const healthCheckSchema = z.object({
  sales: z.number().min(0).max(100),
  revenue: z.number().min(0).max(100),
  marketing: z.number().min(0).max(100),
  hiring: z.number().min(0).max(100),
  team: z.number().min(0).max(100),
  operations: z.number().min(0).max(100),
});

const createProblemSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  category: z.string().optional(),
});

module.exports = { healthCheckSchema, createProblemSchema };