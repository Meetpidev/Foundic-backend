const ApiError = require("../../utils/ApiError");
const repo = require("./execution.repository");

async function getWorkspace(projectId) {
  const workspace = await repo.getWorkspace(projectId);
  if (!workspace) throw new ApiError(404, "Project not found");
  return workspace;
}

async function createTask(projectId, data) {
  return repo.createTask(projectId, data);
}

async function updateTaskStatus(taskId, status, completionPct) {
  const data = { status };
  if (completionPct !== undefined) data.completionPct = completionPct;
  return repo.updateTask(taskId, data);
}

async function listTasks(projectId) {
  return repo.listTasks(projectId);
}

async function createSprint(projectId, data) {
  return repo.createSprint(projectId, data);
}

async function submitDailyUpdate(projectId, userId, data) {
  return repo.createDailyUpdate(projectId, userId, data);
}

async function scheduleMeeting(projectId, data) {
  return repo.createMeeting(projectId, data);
}

async function getProgressDashboard(projectId) {
  return repo.getProgress(projectId);
}

module.exports = {
  getWorkspace,
  createTask,
  updateTaskStatus,
  listTasks,
  createSprint,
  submitDailyUpdate,
  scheduleMeeting,
  getProgressDashboard,
};