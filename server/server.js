const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const router = require("./router");

const PORT = process.env.PORT || 5000;

const app = express();

const server = http.createServer(app);
const io = socketio(server);
app.use(router);

//integrating socket
io.on("connection", socket => {
  console.log("new socket connection");
  socket.on("disconnect", () => {
    console.log("user has left");
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
