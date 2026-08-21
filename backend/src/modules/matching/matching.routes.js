const express = require("express");
const controller = require("./matching.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const rbac = require("../../middlewares/rbac.middleware");

const router = express.Router();

router.post("/:problemId/run", authMiddleware, rbac("FOUNDIC_TEAM", "ADMIN"), controller.run);

module.exports = router;