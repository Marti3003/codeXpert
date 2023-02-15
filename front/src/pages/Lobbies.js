import React, { useEffect, useState } from "react";
import "../normalize.css";
import "../Lobbies.css";
import Chat from "../components/Chat";
import IconUser from "../components/IconUser";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import routes from "../index";
import { Blocks } from 'react-loader-spinner'
import lobbyTitle from '../img/lobbies.gif'





// socket.io

const Lobbies = ({ socket }) => {
  const [lobbyName, setLobbyName] = useState("");
  const [lobbyList, setLobbyList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [joinedLobby, setJoined] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const [messages, setMessages] = useState([]);
  const [fetchUser, setfetchUser] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const cookies = new Cookies();

  const handleLeave = (e) => {
    e.preventDefault();
    console.log("has abandonat la sala " + lobbyName);
    socket.emit("leave lobby", lobbyName);
    setJoined(false);
    setLobbyName("");
    setLobbyList([]);
    setMessages([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("new lobby", lobbyName);
    socket.emit("join room", {
      lobby_name: lobbyName,
      rank: "Owner",
    });
    setJoined(true);
  };

  const handleJoin = (e) => {
    e.preventDefault();
    setLobbyName(e.target.id);
    socket.emit("join room", {
      lobby_name: e.target.id,
      rank: "Member",
    });

    console.log(socket);
    setJoined(true);
  };

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

  function startGame() {
    socket.emit("start_game");
    navigate("/game");
  }

  useEffect(() => {
    if (document.cookie.indexOf("token" + "=") != -1) {
      const token = new FormData();
      token.append("token", cookies.get('token'))
      fetch(routes.fetchLaravel + "/index.php/isUserLogged", {
        method: "POST",
        mode: "cors",
        body: token,
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setfetchUser(true)
          } else {
            navigate("/login");
          }
        });
    } else {
      navigate("/login");
    }

    if (firstTime) {
      socket.emit("hello", "gimme gimme");
      setFirstTime(true);
    }

    socket.on("lobbies list", function (lobbylist) {
      setLobbyList(lobbylist);
    });

    socket.on("lobby user list", (data) => {
      setUserList(data.list);
    });

    socket.on("player joined", (id) => {
      console.log(id + " joined the lobby");
    });

    socket.on("lobby-message", function (data) {
      setMessages(data.messages);
    });

    socket.on("game_started", () => {
      navigate("/game");
    });

  }, []);

  if (fetchUser) {
    return (
      <div className="lobbies">
        <IconUser></IconUser>
        {!joinedLobby && (
          <div id="lobbyList" className="lobbies__lobbylist lobbylist">
            <div className="lobbylist__container">
              <img
                className="lobbies__title"
                src={lobbyTitle} alt="LOBBIES"
              />
              {/* onClick={() => {
                  socket.emit("hello", "gimme gimme");
                }} */}
              <ul className="lobbies__table table">
                <li className="table__header">
                  <div className="col col-1">ID</div>
                  <div className="col col-2">Lobby Name</div>
                  <div className="col col-3">Owner</div>
                  <div className="col col-4">Players</div>
                </li>
                <div className="table__body">
                  {lobbyList.map((element, index) => {
                    return (
                      <li
                        className="table__row row"
                        onClick={handleJoin}
                        key={index}
                        id={element.lobby_name}
                      >
                        <div
                          id={element.lobby_name}
                          className="col col-1"
                          data-label="Lobby Id"
                        >
                          {index + 1}
                        </div>
                        <div
                          id={element.lobby_name}
                          className="col col-2"
                          data-label="Lobby Name"
                        >
                          {element.lobby_name}
                        </div>
                        <div
                          id={element.lobby_name}
                          className="col col-3"
                          data-label="Owner"
                        >
                          {element.members[0].nom}
                        </div>
                        <div
                          id={element.lobby_name}
                          className="col col-4"
                          data-label="Players"
                        >
                          {element.members.length} / 5
                        </div>
                      </li>
                    );
                  })}
                </div>
              </ul>
            </div>
            <form
              id="form"
              className="lobbies__form"
              onSubmit={handleSubmit}
            >
              <label>
                <input
                  id="inputLobby"
                  className="form__inputLobby"
                  autoComplete="off"
                  type="text"
                  value={lobbyName}
                  placeholder="Lobby name"
                  onChange={(e) => {
                    setLobbyName(e.target.value);
                  }}
                />
              </label>
              <button className="lobbies__button" disabled={lobbyName === ""}>
                Create lobby
              </button>
            </form>
          </div>
        )}

        {joinedLobby && (
          <div id="lobbyJoined" className="lobbies__lobby lobby">
            <button
              id="leaveLobby"
              className="lobby__leaveButton pixel-button"
              onClick={handleLeave}
            >
              Leave current lobby
            </button>
            <div className="lobby__connectedUsers">
              <h1 className="connectedUsers_title">Connected users</h1>
              <ul id="userList" className="connectedUsers__userList userList">
                {userList.map((user, index) => {
                  return (
                    <li className="userList__item item" key={index}>
                      <img
                        src={user.avatar}
                        width="50px"
                        className="item__image"
                        alt={user.name + "'s avatar"}
                      ></img>
                      {user.name}
                    </li>
                  );
                })}
              </ul>
            </div>
            <button className="pixel-button" onClick={startGame}>Start game</button>
            {/* Chat :) */}
            <div className="lobby__chat chat">
              <h3 className="chat__title">Lobby chat</h3>
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
                <button className="pixel-button">Send</button>
              </form>
            </div>
            {/* Fin del chat */}
          </div>
        )}
      </div>
    );
  } else {
    return (
      <>
        <h1>Loading</h1>
        <Blocks
          visible={true}
          height="80"
          width="80"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
        />
      </>
    );
  }

};

export default Lobbies;
