import "../normalize.css";
import { useState, useEffect } from "react";

function Chat({ socket, lobbyName }) {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (msg != "") {
      socket.emit("chat message", {
        message: msg,
        room: lobbyName,
      });
      setMsg("");
    }
  };

  useEffect(() => {
    socket.on("lobby-message", function (data) {
      setMessages(data.messages);
    });

    if (document.getElementById('input_message') === document.click) {
      document.getElementById('chat__body').style.display = "block";
      document.getElementById('chat__body').style.transition = "all 2s ease-in";
    }
    if (!document.getElementById('input_message') === document.click) {
      document.getElementById('chat__body').style.display = "none";
    }

    document.getElementById('chat__body').scrollTop = document.getElementById('chat__body').scrollHeight;

  })

  return (
    <div className="lobby__chat chat">
      <div className="chat__body" id="chat__body">
        <ul id="messages" className="lobby__chat chat">
          {Array.isArray(messages)
            ? messages.map((element, index) => {
              if (element.nickname != "ingame_events") {
                return (
                  <li className="chat__message" key={index}>
                    <img
                      src={element.avatar}
                      width="50px"
                      className="user__image"
                      alt={element.nickname + "'s avatar"}
                    ></img>{element.nickname + ": " + element.message}
                  </li>
                );
              } else {
                return (
                  <li className="chat__message chat__message--event" key={index}>
                    {element.message}
                  </li>
                );
              }
            })
            : null}
        </ul>
      </div>
      <form id="form" onSubmit={handleSendMessage}>
        <div className="form--grid">
          <div className="inputMsg-div">
            <input
              id="input_message"
              autoComplete="off"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
          </div>

          <div className="buttonMsg-div">
            <button className="send__button">Send</button>
          </div>
        </div>
      </form>
    </div>

  );
}

export default Chat;
