const service = require("./execution.service");

async function getWorkspace(req, res, next) {
  try {
    res.json({ success: true, data: await service.getWorkspace(req.params.id) });
  } catch (err) {
    next(err);
  }
}

async function createTask(req, res, next) {
  try {
    res.status(201).json({ success: true, data: await service.createTask(req.params.id, req.body) });
  } catch (err) {
    next(err);
  }
}

async function updateTask(req, res, next) {
  try {
    const { status, completionPct } = req.body;
    res.json({ success: true, data: await service.updateTaskStatus(req.params.taskId, status, completionPct) });
  } catch (err) {
    next(err);
  }
}

async function listTasks(req, res, next) {
  try {
    res.json({ success: true, data: await service.listTasks(req.params.id) });
  } catch (err) {
    next(err);
  }
}

async function createSprint(req, res, next) {
  try {
    res.status(201).json({ success: true, data: await service.createSprint(req.params.id, req.body) });
  } catch (err) {
    next(err);
  }
}

async function submitDailyUpdate(req, res, next) {
  try {
    res.status(201).json({
      success: true,
      data: await service.submitDailyUpdate(req.params.id, req.user.id, req.body),
    });
  } catch (err) {
    next(err);
  }
}

async function scheduleMeeting(req, res, next) {
  try {
    res.status(201).json({ success: true, data: await service.scheduleMeeting(req.params.id, req.body) });
  } catch (err) {
    next(err);
  }
}

async function progress(req, res, next) {
  try {
    res.json({ success: true, data: await service.getProgressDashboard(req.params.id) });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getWorkspace,
  createTask,
  updateTask,
  listTasks,
  createSprint,
  submitDailyUpdate,
  scheduleMeeting,
  progress,
};