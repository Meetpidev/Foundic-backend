const { PrismaClient } = require("../../generated/prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { DIRECT_URL, DATABASE_URL, NODE_ENV } = require("./env");

const adapter = new PrismaPg({
  connectionString: DIRECT_URL || DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const prisma = new PrismaClient({
  adapter,
  log: NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

module.exports = prisma;