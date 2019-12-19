const express = require("express");
const socketio = require("socket.io");
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
    callback();
  });

  // message input by the user from the frontend
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });
    callback();
  });

  socket.on("disconnect", () => {
    console.log("user has left");
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
