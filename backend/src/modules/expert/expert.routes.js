const express = require("express");
const controller = require("./expert.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const rbac = require("../../middlewares/rbac.middleware");

const router = express.Router();

router.post("/register", authMiddleware, rbac("EXPERT"), controller.register);
router.get("/opportunities", authMiddleware, rbac("EXPERT"), controller.opportunities);

router.patch("/:id/status", authMiddleware, rbac("FOUNDIC_TEAM", "ADMIN"), controller.updateStatus);

module.exports = router;