import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./join.css";
const Join = () => {
  // React Hooks: array with variable, setter and initial value as setState

  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  return (
    <div className='joinOuterContainer'>
      <div className='joinInnerContainer'>
        <h1 className='heading'>Join</h1>
        <div>
          <input
            className='joinInput'
            type='text'
            onChange={event => setName(event.target.value)}
            placeholder='Name'
          />
        </div>
        <div>
          <input
            className='joinInput mt-20'
            type='text'
            onChange={event => setRoom(event.target.value)}
            placeholder='Room'
          />
        </div>
        <Link
          onClick={event => (!name || !room ? event.preventDefault() : null)}
          to={`/chat?name=${name}&room=${room}`}
        >
          <button className='button mt-20' type='submit'>
            Join
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Join;
