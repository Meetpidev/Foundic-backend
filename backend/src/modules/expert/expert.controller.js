const prisma = require("../../config/db");
const service = require("./expert.service");
const ApiError = require("../../utils/ApiError");

async function register(req, res, next) {
  try {
    const data = await service.registerProfile(req.user.id, req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const expert = await prisma.expertProfile.findUnique({ where: { id: req.params.id } });
    if (!expert) throw new ApiError(404, "Expert not found");

    const updated = await service.transitionStatus(expert.id, expert.status, req.body.status);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

async function opportunities(req, res, next) {
  try {
    const data = await service.getOpportunities(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function dashboard(req, res, next) {
  try {
    const data = await service.getDashboard(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, updateStatus, opportunities, dashboard };