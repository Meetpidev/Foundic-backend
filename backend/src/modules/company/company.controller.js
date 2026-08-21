const service = require("./company.service");

async function getProfile(req, res, next) {
  try {
    res.json({ success: true, data: await service.getProfile(req.user.id) });
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    res.json({ success: true, data: await service.updateProfile(req.user.id, req.body) });
  } catch (err) {
    next(err);
  }
}

async function getProjects(req, res, next) {
  try {
    res.json({ success: true, data: await service.getProjects(req.user.id) });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, updateProfile, getProjects };