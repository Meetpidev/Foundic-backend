const express = require("express");
const controller = require("./execution.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

const router = express.Router();
router.use(authMiddleware);

router.get("/:id/workspace", controller.getWorkspace);
router.get("/:id/progress", controller.progress);

router.get("/:id/tasks", controller.listTasks);
router.post("/:id/tasks", controller.createTask);
router.patch("/tasks/:taskId", controller.updateTask);

router.post("/:id/sprints", controller.createSprint);
router.post("/:id/daily-updates", controller.submitDailyUpdate);
router.post("/:id/meetings", controller.scheduleMeeting);

module.exports = router;