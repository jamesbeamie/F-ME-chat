import React from "react";
import "./input.css";

const InputComponent = ({ message, setMessage, sendMessage }) => (
  <form className='form'>
    <input
      className='input'
      type='text'
      placeholder='write msg'
      value={message}
      onChange={event => setMessage(event.target.value)}
      onKeyPress={event => (event.key === "Enter" ? sendMessage() : null)}
    />
    <button className='sendButton' onClick={event => sendMessage(event)}>
      Send
    </button>
  </form>
);

export default InputComponent;
