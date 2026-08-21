const service = require("./notification.service");

async function list(req, res, next) {
  try {
    res.json({ success: true, data: await service.listForUser(req.user.id) });
  } catch (err) {
    next(err);
  }
}

async function markRead(req, res, next) {
  try {
    await service.markRead(req.params.id, req.user.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, markRead };