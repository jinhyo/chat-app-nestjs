import React from "react";
import "./Input.css";

function Input({ message, setMessage, sendMessage }) {
  return (
    <div>
      <form className="form">
        <input
          className="input"
          type="text"
          placeholder="type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="sendButton" onClick={(e) => sendMessage(e)}>
          send
        </button>
      </form>
    </div>
  );
}

export default Input;
