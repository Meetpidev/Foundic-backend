const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const pinoHttp = require("pino-http");
const rateLimit = require("express-rate-limit");

const errorMiddleware = require("./middlewares/error.middleware");

const authRoutes = require("./modules/auth/auth.routes");
const founderRoutes = require("./modules/founder/founder.routes");
const companyRoutes = require("./modules/company/company.routes");
const expertRoutes = require("./modules/expert/expert.routes");
const matchingRoutes = require("./modules/matching/matching.routes");
const proposalRoutes = require("./modules/proposal/proposal.routes");
const executionRoutes = require("./modules/execution/execution.routes");
const notificationRoutes = require("./modules/notifications/notification.routes");
const revenueRoutes = require("./modules/revenue/revenue.routes");

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(pinoHttp());

const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use(globalLimiter);

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/founder", founderRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/expert", expertRoutes);
app.use("/api/v1/experts", expertRoutes);
app.use("/api/v1/matching", matchingRoutes);
app.use("/api/v1/proposals", proposalRoutes);
app.use("/api/v1/projects", executionRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/revenue", revenueRoutes);

app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));
app.use(errorMiddleware);

module.exports = app;