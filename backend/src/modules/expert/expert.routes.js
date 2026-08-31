// src/modules/expert/expert.routes.js
const express = require("express");
const controller = require("./expert.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const rbac = require("../../middlewares/rbac.middleware");

const router = express.Router();

router.get("/dashboard", authMiddleware, rbac("EXPERT"), controller.dashboard);
router.post("/register", authMiddleware, rbac("EXPERT"), controller.register);
router.get("/opportunities", authMiddleware, rbac("EXPERT"), controller.opportunities);

// Only Foundic Team can move an expert through the approval pipeline
router.patch("/:id/status", authMiddleware, rbac("FOUNDIC_TEAM", "ADMIN"), controller.updateStatus);

module.exports = router;