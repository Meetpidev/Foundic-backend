// src/modules/revenue/revenue.routes.js
const express = require("express");
const controller = require("./revenue.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const rbac = require("../../middlewares/rbac.middleware");

const router = express.Router();

router.post("/webhook", controller.webhook); // no auth — verified via gateway signature in production
router.post("/:projectId/invoices", authMiddleware, rbac("FOUNDIC_TEAM", "ADMIN"), controller.createInvoice);
router.get("/:projectId/invoices", authMiddleware, controller.listInvoices);

module.exports = router;