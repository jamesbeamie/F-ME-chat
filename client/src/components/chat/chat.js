import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";

import "./chat.css";
import InfoBar from "../infobar/infoBar";
import InputComponent from "../input/inputComponent";
import Messages from "../messages/messages";

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
    console.log("Majina", name, room);

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
    event.preventDefault();
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
        <InputComponent
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
        <Messages messages={messages} name={name} />
      </div>
    </div>
  );
};
export default Chat;
