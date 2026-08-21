const prisma = require("../../config/db");

function getWorkspace(projectId) {
  return prisma.project.findUnique({
    where: { id: projectId },
    include: { executionPlan: true, milestones: true, tasks: true, sprints: true },
  });
}

function createTask(projectId, data) {
  return prisma.task.create({ data: { ...data, projectId } });
}

function updateTask(taskId, data) {
  return prisma.task.update({ where: { id: taskId }, data });
}

function listTasks(projectId) {
  return prisma.task.findMany({ where: { projectId }, orderBy: { createdAt: "desc" } });
}

function createSprint(projectId, data) {
  return prisma.sprint.create({ data: { ...data, projectId } });
}

function createDailyUpdate(projectId, userId, data) {
  return prisma.dailyUpdate.create({ data: { ...data, projectId, userId } });
}

function createMeeting(projectId, data) {
  return prisma.meeting.create({ data: { ...data, projectId } });
}

async function getProgress(projectId) {
  const tasks = await prisma.task.findMany({ where: { projectId } });
  const milestones = await prisma.milestone.findMany({ where: { projectId } });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "DONE").length;
  const taskProgress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalMilestones = milestones.length;
  const doneMilestones = milestones.filter((m) => m.status === "done").length;
  const milestoneProgress = totalMilestones ? Math.round((doneMilestones / totalMilestones) * 100) : 0;

  return {
    taskProgress,
    milestoneProgress,
    overallProgress: Math.round((taskProgress + milestoneProgress) / 2),
    pendingItems: totalTasks - completedTasks,
    completedItems: completedTasks,
  };
}

module.exports = {
  getWorkspace,
  createTask,
  updateTask,
  listTasks,
  createSprint,
  createDailyUpdate,
  createMeeting,
  getProgress,
};