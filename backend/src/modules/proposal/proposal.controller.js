// src/modules/proposal/proposal.controller.js
const service = require("./proposal.service");

async function create(req, res, next) {
  try {
    const data = await service.createProposal(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function approve(req, res, next) {
  try {
    const data = await service.approveProposal(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, approve };