const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// store online users
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", (username) => {
    onlineUsers.set(username, socket.id);
  });

  socket.on("disconnect", () => {
    for (let [key, value] of onlineUsers.entries()) {
      if (value === socket.id) {
        onlineUsers.delete(key);
      }
    }
  });
});

module.exports = { io, onlineUsers };
