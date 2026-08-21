const express = require("express");
const controller = require("./company.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const rbac = require("../../middlewares/rbac.middleware");

const router = express.Router();
router.use(authMiddleware, rbac("COMPANY"));

router.get("/profile", controller.getProfile);
router.put("/profile", controller.updateProfile);
router.get("/projects", controller.getProjects);

module.exports = router;