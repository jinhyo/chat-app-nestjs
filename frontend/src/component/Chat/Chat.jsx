import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import "./Chat.css";
import InfoBar from "../InforBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import TextContainer from "../TextContainer/TextContainer";

let socket;

function Chat({ location }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const END_POINT = "http://localhost:3001";

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(`${END_POINT}/chat`);

    setName(name);
    setRoom(room);

    // socket.emit("join", { name, room }, () => {});
    socket.emit("msgToServer", { name, room });
    // socket.emit("events", { name, room });

    return () => {
      socket.emit("disconnet");
      socket.off();
    };
  }, [END_POINT, location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
      console.log("message~", message);
    });
    socket.on("msgToClient", (message) => {
      console.log("msgToClient: ", message);
    });
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, [message]);

  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      socket.emit("sendMessage", message);
      setMessages([...messages, message]);
      setMessage("");
    }
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          sendMessage={sendMessage}
          setMessage={setMessage}
        />
      </div>
      <TextContainer users={users} />
    </div>
  );
}

export default Chat;
