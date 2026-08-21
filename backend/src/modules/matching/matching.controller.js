// src/modules/matching/matching.controller.js
const service = require("./matching.service");

async function run(req, res, next) {
  try {
    const data = await service.runMatching(req.params.problemId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { run };