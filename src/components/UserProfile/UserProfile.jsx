import React, { useState, useEffect } from "react";
import "./UserProfile.css";
import { userStore } from "../../stores/UserStore";
import { useNavigate, useParams } from "react-router-dom";
import "react-chat-elements/dist/main.css";
import { MessageBox } from "react-chat-elements";
import { Input } from "react-chat-elements";
import { Button } from "react-chat-elements";

function UserProfile() {
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  const { username } = useParams();
  const typeOfUser = userStore((state) => state.typeOfUser);
  const fetchUsers = userStore((state) => state.fetchUsers);
  const [messageText, setMessageText] = useState(""); // Inicializando com uma string vazia
  const [messages, setMessages] = useState([]);

/*   const firstName = userStore(
    (state) => state.users.find((user) => user.username === username).firstName
  );
  const lastName = userStore(
    (state) => state.users.find((user) => user.username === username).lastName
  ); */

  const sender = userStore((state) => state.username);
  const receiver = username;

  const token = userStore((state) => state.token);

  const websocket = new WebSocket(
    `ws://localhost:8080/project5/websocket/notifier/${token}/${receiver}`
  );

  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/project5/rest/users/${username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
          }
        );

        if (response.ok) {
          const userData = await response.json();
          console.log("userData", userData);
          setInputs(userData);
        } else {
          console.error("Error fetching user data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [username, token]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8080/project5/rest/users/update/${username}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify(inputs),
        }
      );

      if (response.ok) {
        await fetchUsers();
        navigate("/users-list", { replace: true });
      } else {
        const responseBody = await response.text();
        console.error(
          "Error updating profile:",
          response.statusText,
          responseBody
        );
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    navigate("/users-list", { replace: true });
  };

  const handleOpenChat = (event) => {
    event.preventDefault();
    setIsChatOpen((prevIsChatOpen) => !prevIsChatOpen); // Inverte o estado do chat
    const button = event.currentTarget;
    if (isChatOpen) {
      button.setAttribute("data-text", "Close chat"); // Define o atributo data-text como "Close chat" quando o chat está aberto
    } else {
      button.setAttribute("data-text", "Open chat"); // Define o atributo data-text como "Open chat" quando o chat está fechado
    }
  };

  const sendMessage = (message) => {
    const messageObject = {
      sender: sender,
      receiver: receiver,
      text: message,
      date: new Date().toISOString(),
    };
    console.log("token", token);
    setMessages(prevMessages => [...prevMessages, messageObject]);
    try {
      // Verifica se a conexão WebSocket está aberta
      if (websocket.readyState === WebSocket.OPEN) {
        // Envia a mensagem no formato JSON
        websocket.send(JSON.stringify(messageObject));
        console.log("Message sent:", messageObject);
        setMessageText("");
      } else {
        console.error("WebSocket connection is not open.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
     // Limpa o campo de texto

  };

  useEffect(() => {
    const handleMessage = (event) => {
      // Parse da mensagem recebida para um objeto JavaScript
      const messageData = JSON.parse(event.data);
      console.log("Message received:", messageData);
      
      // Cria um novo objeto de mensagem com os dados recebidos
      const message = {
        sender: messageData.sender,
        receiver: messageData.receiver,
        text: messageData.text,
        date: new Date(messageData.date), // Convertendo a data para um objeto Date
      };
      // Adiciona a mensagem à lista de mensagens
      setMessages(prevMessages => [...prevMessages, message]);
    };
  
    websocket.addEventListener("message", handleMessage);
  
    return () => {
      websocket.removeEventListener("message", handleMessage);
    };
  }, [websocket]);



  return (
    <div className="container">
      <div className="editProfilePanel">
        <div className="editProfile-title-photo">
          {inputs.photoURL && (
            <img
              src={inputs.photoURL}
              alt="User"
              className="editProfile-photo"
            />
          )}
          <div className="editProfile-title-and-chat">
            <label id="username-title-editProfile">{username}</label>
            <button
              className="open-chat-button"
              onClick={handleOpenChat}
              data-text={isChatOpen ? "Close chat" : "Open chat"} // Define o atributo data-text com base no estado do chat
            >
              {isChatOpen ? "Close chat" : "Open chat"}
            </button>
          </div>
        </div>
        <form
          className="editProfile-register"
          id="edit-profile-form"
          onSubmit={handleSubmit}
        >
          <div className="editProfile-fieldsContainer">
            <div className="left-fields-editProfile">
              <label
                className="labels-edit-profile"
                id="email-editProfile-label"
              >
                Email
              </label>
              <input
                type="email"
                className="editProfile-fields"
                id="email-editProfile"
                onChange={(e) =>
                  setInputs({ ...inputs, email: e.target.value })
                }
                required
                value={inputs.email || ""}
                disabled={typeOfUser !== 300}
              ></input>
              <label
                className="labels-edit-profile"
                id="firstName-editProfile-label"
              >
                First Name
              </label>
              <input
                type="text"
                className="editProfile-fields"
                id="firstName-editProfile"
                name="firstName"
                onChange={(e) =>
                  setInputs({ ...inputs, firstName: e.target.value })
                }
                required
                value={inputs.firstName || ""}
                disabled={typeOfUser !== 300}
              ></input>
              <label
                className="labels-edit-profile"
                id="lastName-editProfile-label"
              >
                Last Name
              </label>
              <input
                type="text"
                className="editProfile-fields"
                id="lastName-editProfile"
                name="lastName"
                onChange={(e) =>
                  setInputs({ ...inputs, lastName: e.target.value })
                }
                required
                value={inputs.lastName || ""}
                disabled={typeOfUser !== 300}
              ></input>
              <label
                className="labels-edit-profile"
                id="phone-editProfile-label"
              >
                Phone
              </label>
              <input
                type="text"
                className="editProfile-fields"
                id="phone-editProfile"
                name="phone"
                onChange={(e) =>
                  setInputs({ ...inputs, phone: e.target.value })
                }
                required
                value={inputs.phone || ""}
                disabled={typeOfUser !== 300}
              ></input>
              <label
                className="labels-edit-profile"
                id="photoURL-editProfile-label"
              >
                Photo URL
              </label>
              <input
                type="url"
                className="editProfile-fields"
                id="photoURL-editProfile"
                name="photoURL"
                onChange={(e) =>
                  setInputs({ ...inputs, photoURL: e.target.value })
                }
                required
                value={inputs.photoURL || ""}
                disabled={typeOfUser !== 300}
              ></input>
            </div>
          </div>
          {typeOfUser === 300 && (
            <div className="editProfile-Buttons">
              <button type="submit" id="profile-save-button">
                Save
              </button>
              <button
                type="reset"
                id="profile-cancel-button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
      <div
        className="chatPanel"
        style={{ display: isChatOpen ? "block" : "none" }}
      >
        {messages.map((messageObject, index) => (
          <MessageBox
            key={index}
            position={messageObject.sender === sender ? "right" : "left"}
            title={messageObject.sender === sender ? "You" : receiver}
            type="text"
            text={messageObject.text}
            date={messageObject.date}
          />
        ))}
        <Input
          type="text"
          placeholder="Type here..." 
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          multiline={true}
          autofocus={true}
        />
        <Button
          text={"Send"}
          onClick={() => sendMessage(messageText)}
          title="Send"
        />
      </div>
    </div>
  );
}

export default UserProfile;
