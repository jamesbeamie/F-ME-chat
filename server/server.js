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
    const { error, newUser } = addUser({ id: socket.id, name, room });
    if (error) {
      return callback(error);
    }
    // system messages
    socket.emit("message", {
      user: "admin",
      text: `${newUser.name}, welcome to ${newUser.room}`
    });
    //broadcast sends message to everyone on the chanel
    //broadcast.to sends message to specific channel
    socket.broadcast
      .to(newUser.room)
      .emit("message", { user: "admin", text: `${newUser.name} has joined` });
    //socket.join joins a user in a room
    socket.join(newUser.room);
    callback();
  });
  socket.on("disconnect", () => {
    console.log("user has left");
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
