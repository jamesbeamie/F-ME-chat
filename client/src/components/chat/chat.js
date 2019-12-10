import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const endPoint = "localhost:5000";

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    console.log(location.search);
    console.log(name, room);

    socket = io(endPoint);
    console.log("@@@@@@", socket);

    setName(name);
    setRoom(room);
    //Emitting a specific event on hooks

    socket.emit("join", { name, room });
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [endPoint, useEffect]);

  return <h1>Chat</h1>;
};
export default Chat;
