import React, { useEffect, useState } from "react";
import "../normalize.css";
import "../game.css";
import "../Lobbies.css";
import routes from "../index";
import Chat from "../components/Chat";

function Game({ socket }) {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [qst, setQst] = useState({
    // statement: "",
    // input: "",
    // expectedOutput: "",
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (msg != "") {
      socket.emit("chat message", {
        message: msg,
      });
      setMsg("");
    }
  };
  useEffect(() => {
    socket.on("lobby-message", function (data) {
      setMessages(data.messages);
    });
  }, []);

  useEffect(() => {
    socket.on("game_data", function (data) {
      console.log(data);
      setQst(data);
    });
  }, []);

  useEffect(() => {
    console.log(qst);
  }, [qst]);

  return (
    <div className="game">
      <div className="game__statement">
        <h1 className="game__statementTitle">{qst.statement}</h1>
      </div>
      <div className="game--grid">
        <div className="game__expectedInput">
          <h1>{qst.input.toString()}</h1>
        </div>
        <div className="game__expectedOutput">
          <h1>{qst.expectedOutput.toString()}</h1>
        </div>
      </div>
      <div className="editor">
        <div className="input-header">
          <h1>Input</h1>
        </div>
        <div className="file-window js-view">
          <div className="line-numbers">
            1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9<br />
            10
            <br />
            11
            <br />
            12
            <br />
            13
            <br />
            14
            <br />
            15
            <br />
            16
            <br />
            17
            <br />
            18
            <br />
            19
            <br />
            20
          </div>
          <textarea
            className="input-strobe"
            type="text"
            placeholder="Type in your code :)"
          ></textarea>
          <div></div>
          <div className="help">
            <br />
            /* <br />
            This is your code input.
            <br />
            You can, we trust you!! <br />
            */
          </div>
        </div>
      </div>

      <button className="game__submit">Submit</button>
      {/* Chat uwu */}
      {/* <div className="lobby__chat chat">
        <h3 className="chat__title">Game chat</h3>
        <div className="chat__body">
          <Chat className="chat__chatbox" messages={messages}></Chat>
        </div>
        <form id="form" onSubmit={handleSendMessage}>
          <input
            id="input_message"
            autoComplete="off"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <button>Send</button>
        </form>
      </div> */}
      {/* fin del chat uwu */}
    </div>
  );
}

export default Game;
