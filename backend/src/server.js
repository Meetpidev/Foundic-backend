const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const { PORT } = require("./config/env");
const { verifyAccessToken } = require("./utils/jwt");
const prisma = require("./config/db");

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL, credentials: true },
});


io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    const decoded = verifyAccessToken(token);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Unauthorized socket connection"));
  }
});

io.on("connection", (socket) => {
  socket.join(`user:${socket.user.id}`);

  socket.on("project:join", (projectId) => {
    socket.join(`project:${projectId}`);
  });

  socket.on("project:message", async ({ projectId, content, attachments }) => {
    const message = await prisma.message.create({
      data: {
        channelId: projectId,
        senderId: socket.user.id,
        content,
        attachments: attachments || null,
      },
    });
    io.to(`project:${projectId}`).emit("project:message", message);
  });

  socket.on("disconnect", () => {});
});

app.set("io", io); 

server.listen(PORT, () => {
  console.log(`Foundic backend running on port ${PORT}`);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
});