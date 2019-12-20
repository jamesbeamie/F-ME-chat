import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";

import "./chat.css";
import InfoBar from "../infobar/infoBar";

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const endPoint = "localhost:5000";

  // use effect to handle user and room
  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    console.log(location.search);
    console.log(name, room);

    socket = io(endPoint);
    console.log("@@@@@@", socket);

    setName(name);
    setRoom(room);
    //Emitting a specific event on hooks

    socket.emit("join", { name, room }, () => {});
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [endPoint, location.search]);

  // use effect to handle messages
  useEffect(() => {
    socket.on("message", message => {
      setMessages([...messages, message]);
    });
  }, [messages]);

  //sending message
  const sendMessage = event => {
    // event.preventDefault();
    if (message) {
      //sendMessage is an emit listener from the server
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  console.log("ma-messo", message, messages);

  return (
    <div className='outerContainer'>
      <div className='container'>
        <InfoBar room={room} />
        {/* <input
          value={message}
          onChange={event => setMessage(event.target.value)}
          onKeyPress={event => (event.key === "Enter" ? sendMessage() : null)}
        /> */}
      </div>
    </div>
  );
};
export default Chat;
