const { Server } = require("socket.io");

let io;
const userSocketMap = new Map(); // username -> socket

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("authenticate", (username) => {
      if (username) {
        userSocketMap.set(username, socket);
      }
    });

    socket.on("disconnect", () => {
      for (const [user, sock] of userSocketMap.entries()) {
        if (sock.id === socket.id) {
          userSocketMap.delete(user);
          break;
        }
      }
    });
  });

  return io;
};

const getUserSocket = (username) => {
  return userSocketMap.get(username);
};

module.exports = { initSocket, getUserSocket, io };
