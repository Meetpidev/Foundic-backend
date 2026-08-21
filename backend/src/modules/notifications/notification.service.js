const prisma = require("../../config/db");

async function dispatch(io, userId, type, payload) {
  const notification = await prisma.notification.create({
    data: { userId, type, payload },
  });
  io.to(`user:${userId}`).emit("notification", notification);
  return notification;
}

async function listForUser(userId) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

async function markRead(id, userId) {
  return prisma.notification.updateMany({
    where: { id, userId },
    data: { isRead: true },
  });
}

module.exports = { dispatch, listForUser, markRead };