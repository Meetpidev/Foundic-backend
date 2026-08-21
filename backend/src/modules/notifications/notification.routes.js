const express = require("express");
const controller = require("./notification.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

const router = express.Router();
router.use(authMiddleware);

router.get("/", controller.list);
router.patch("/:id/read", controller.markRead);

module.exports = router;