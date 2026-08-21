const { PrismaClient } = require("../../generated/prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { DATABASE_URL, NODE_ENV } = require("./env");

const adapter = new PrismaPg({
  connectionString: DATABASE_URL, // pooled URL — fine for the running app
  ssl: { rejectUnauthorized: false },
});

const prisma = new PrismaClient({
  adapter,
  log: NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

module.exports = prisma;