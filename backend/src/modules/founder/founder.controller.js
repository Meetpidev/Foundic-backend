const service = require("./founder.service");

async function dashboard(req, res, next) {
  try {
    const data = await service.getDashboard(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function healthCheck(req, res, next) {
  try {
    const data = await service.runHealthCheck(req.user.id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function createProblem(req, res, next) {
  try {
    const data = await service.createProblem(req.user.id, req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getProblem(req, res, next) {
  try {
    const data = await service.getProblem(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { dashboard, healthCheck, createProblem, getProblem };