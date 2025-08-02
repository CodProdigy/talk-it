import { Server } from "socket.io";

let io;
const userSocketMap = {}; // ✅ define outside so it’s shared

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
      methods: ["GET", "POST", "PUT"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("joinGroup", ({ groupId }) => {
      socket.join(groupId);
      console.log(`User ${userId} joined group ${groupId}`);
    });

    socket.on("leaveGroup", ({ groupId }) => {
      socket.leave(groupId);
      console.log(`User ${userId} left group ${groupId}`);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
};

export const getIO = () => io;

export const getReceiverSocketId = (userId) => userSocketMap[userId];
