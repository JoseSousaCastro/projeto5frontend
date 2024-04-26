import React, { useState, useEffect } from "react";
import "./UserProfile.css";
import { userStore } from "../../stores/UserStore";
import { useNavigate, useParams } from "react-router-dom";
import "react-chat-elements/dist/main.css";
import { MessageList } from "react-chat-elements";
import { Input } from "react-chat-elements";
import { Button } from "react-chat-elements";

function UserProfile() {
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  const { username } = useParams();
  const typeOfUser = userStore((state) => state.typeOfUser);
  const fetchUsers = userStore((state) => state.fetchUsers);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);

  const sender = userStore((state) => state.username);
  const receiver = username;
  const token = userStore((state) => state.token);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatSocket, setChatSocket] = useState(null);

  console.log("messages antes de tudo", messages)


  // Código do usuário

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

  // Código do chat

  const handleToggleChat = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8080/project5/rest/users/getAllMessagesBetweenUsers/${username}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

      if (response.ok) {
        const messagesData = await response.json();
        console.log("Messages fetched:", messagesData);
        const formattedMessages = messagesData.map((message) => ({
          sender: message.senderUsername,
          receiver: message.receiverUsername,
          text: message.message,
          date: new Date(message.sentAt),
          status: {
            status:
              message.senderUsername === sender && message.read === true
                ? "read"
                : "sent",
          },
        }));
        console.log("Formatted messages:", formattedMessages);
        setMessages(formattedMessages);
        console.log("messages depois do handleToggleChat", messages)

      } else {
        console.error("Error fetching messages:");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }

    // Abrir o WebSocket
    if (isChatOpen === false) {
      const chatSocket = new WebSocket(
        `ws://localhost:8080/project5/websocket/chat/${token}/${receiver}`
      );
      chatSocket.onopen = () => {
        console.log("Chat socket opened");
        setChatSocket(chatSocket);
      };
    } else {
      if (chatSocket) {
        chatSocket.close();
        console.log("Chat socket closed");
        setChatSocket(null);
      }
    }

    setIsChatOpen((prevIsChatOpen) => !prevIsChatOpen);
  };

  console.log("messages depois do handleToggleChat 2", messages)


  const sendMessage = (message) => {
    const messageObject = {
      sender: sender,
      receiver: receiver,
      text: message,
      date: new Date().toISOString(),
      status: "sent",
    };
    setMessages((prevMessages) => [...prevMessages, messageObject]);
    console.log("messages depois do sendMessages 1", messages)

    try {
      if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
        chatSocket.send(JSON.stringify(messageObject));
        document.getElementsByClassName("rce-input")[0].value = "";
      } else {
        console.error("WebSocket chatSocket is not open.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  console.log("messages depois do sendMessages 2", messages)


  useEffect(() => {
    const handleMessage = (event) => {
      try {
        const messageData = JSON.parse(event.data);
        console.log("Message received:", messageData);
        const message = {
          sender: messageData.senderUsername,
          receiver: messageData.receiverUsername,
          text: messageData.message,
          date: new Date(messageData.sentAt),
          status: {
            status: messageData.senderUsername === sender ? "read" : "sent",
          },
        };
        console.log("Message parsed:", message);
        setMessages((prevMessages) => [...prevMessages, message]);
        console.log("messages depois do handleMessage 1", messages)

      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    if (chatSocket) {
      console.log("WebSocket connection established");
      chatSocket.addEventListener("message", handleMessage);
    } else {
      console.error("WebSocket connection not available");
    }

    return () => {
      if (chatSocket) {
        console.log("Closing WebSocket connection");
        chatSocket.removeEventListener("message", handleMessage);
      }
    };
  }, [chatSocket]);

  console.log("messages depois do handleMessage 2", messages)


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
              onClick={handleToggleChat}
              data-text={isChatOpen ? "Close chat" : "Open chat"}
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
        <div className="chat-list">
          <MessageList
            className="message-list"
            lockable={true}
            toBottomHeight={"100%"}
            dataSource={messages.map((messageObject, index) => ({
              position: messageObject.sender === sender ? "right" : "left",
              type: "text",
              text: messageObject.text,
              date: messageObject.date,
              title: messageObject.sender === sender ? "You" : receiver,
              status: messageObject.status,
              key: index, // Chave única para cada item na lista
            }))}
          />
        </div>
        <div className="chat-input">
          <Input
            type="text"
            placeholder="Type here..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            multiline={true}
            autofocus={true}
            rightButtons={
              <Button
                color="#2CCCD3"
                backgroundColor="#223C4A"
                text={"SEND"}
                onClick={() => sendMessage(messageText)}
              />
            }
          />
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
