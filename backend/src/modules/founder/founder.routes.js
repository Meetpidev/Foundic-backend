const express = require("express");
const controller = require("./founder.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const rbac = require("../../middlewares/rbac.middleware");
const validate = require("../../middlewares/validate.middleware");
const { healthCheckSchema, createProblemSchema } = require("./founder.validators");

const router = express.Router();

router.use(authMiddleware, rbac("FOUNDER"));

router.get("/dashboard", controller.dashboard);
router.post("/health-check", validate(healthCheckSchema), controller.healthCheck);
router.post("/problems", validate(createProblemSchema), controller.createProblem);
router.get("/problems/:id", controller.getProblem);

module.exports = router;