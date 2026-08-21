const express = require("express");
const controller = require("./proposal.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const rbac = require("../../middlewares/rbac.middleware");

const router = express.Router();
router.use(authMiddleware);

router.post("/", rbac("FOUNDIC_TEAM", "EXPERT"), controller.create);
router.post("/:id/approve", rbac("FOUNDER"), controller.approve);

module.exports = router;