const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const http = require("http");
const router = require("./router");

const {
  addUser,
  removeUser,
  getUser,
  getUsersInSpecificRoom
} = require("./users");

const PORT = process.env.PORT || 5000;

const app = express();

const server = http.createServer(app);
const io = socketio(server);
app.use(router);
app.use(cors());

//integrating socket
io.on("connection", socket => {
  //accessing join from the frontend
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) {
      return callback(error);
    }
    // system messages
    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to ${user.room}`
    });
    //broadcast sends message to everyone on the chanel
    //broadcast.to sends message to specific channel
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined` });
    //socket.join joins a user in a room
    socket.join(user.room);
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInSpecificRoom(user.room)
    });
    callback();
  });

  // message input by the user from the frontend
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInSpecificRoom(user.room)
    });
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left`
      });
    }
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
