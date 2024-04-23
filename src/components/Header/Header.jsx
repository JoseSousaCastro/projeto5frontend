import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Header/Header.css";
import { userStore } from "../../stores/UserStore";

function Header() {
  const navigate = useNavigate();
  const updateUserStore = userStore((state) => state);
  const [notificationsArray, setNotificationsArray] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);

  const [websocket, setWebsocket] = useState(null);

  const firstName = userStore((state) => state.firstName);
  const photoURL = userStore((state) => state.photoURL);
  const typeOfUser = userStore((state) => state.typeOfUser);
  const token = userStore((state) => state.token);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/project5/rest/users/getALlUnreadNotifications`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Received notification counts:", data);
        const notificationArray = Object.entries(data).map(
          ([sender, count]) => ({
            sender,
            count,
          })
        );
        setNotificationsArray(notificationArray);
        setNotificationsCount(notificationArray.length);

        console.log("Notification array:", notificationArray);
      } else {
        console.error(
          "Failed to fetch notifications:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Chamada da função para buscar as notificações ao iniciar o componente
  useEffect(() => {
    fetchNotifications();
  }, []);


  useEffect(() => {
    const notificationSocket = new WebSocket(
      `ws://localhost:8080/project5/websocket/notifications/${token}`
    );
    setWebsocket(notificationSocket);

    if (notificationSocket) {
      notificationSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received notification:", data);

        const { senderUsername } = data;
        const existingNotification = notificationsArray.find(
          (notification) => notification.sender === senderUsername
        );
        if (existingNotification) {
          setNotificationsArray((prevNotifications) =>
            prevNotifications.map((notification) => {
              if (notification.sender === senderUsername) {
                return { ...notification, count: notification.count + 1 };
              }
              return notification;
            })
          );
        } else {
          setNotificationsArray((prevNotifications) => [
            ...prevNotifications,
            { sender: senderUsername, count: 1 },
          ]);
          setNotificationsCount((prevCount) => prevCount + 1);
        }
      }
    }
  }, [token]);

  const processLogout = async (event) => {
    event.preventDefault();

    try {
      const logout = await fetch(
        "http://localhost:8080/project5/rest/users/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );
      if (!logout.ok) {
        console.error("Error: Logout failed.");
      } else {
        console.log("Logout successful.");
        updateUserStore.updateToken(""); // Limpar o token
        updateUserStore.updatePassword(""); // Limpar a senha, se estiver armazenada
        // Limpar dados armazenados na sessionStorage
        sessionStorage.removeItem("categoryStore");
        sessionStorage.removeItem("taskStore");
        sessionStorage.removeItem("userStore");
        sessionStorage.removeItem("websocketStore");

        // Limpar o WebSocket
        if (websocket) {
          websocket.close();
        }
        console.log("WebSocket closed");

        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleClick = (event) => {
    event.preventDefault();
    navigate("/edit-profile");
  };

  const handleNotificationSelect = (event) => {
    const selectedIndex = event.target.value;
    const selectedNotification = notificationsArray[selectedIndex];
    if (selectedNotification) {
      const senderUsername = selectedNotification.sender;
      navigate(`/user-profile/${senderUsername}`);
    }
  };

  return (
    <div className="header" id="header-outer-container">
      <div className="page-wrap" id="header-page-wrap">
        <div className="logo-home-container">
          <img
            src="/multimedia/logo-scrum-05.png"
            id="logo-header"
            height="50"
            alt="Agile-Scrum-logo"
          />
        </div>
        <div className="nav-left-container">
          <nav className="nav-menu-left">
            <ul id="menu">
              <li id="nav-tasks">
                <Link to="/home">Tasks</Link>
              </li>
              {typeOfUser === 300 ? (
                <li id="nav-users">
                  <Link to="/users-list">Users</Link>
                </li>
              ) : (
                <li id="nav-users">
                  <Link to="/users-list-all">Users</Link>
                </li>
              )}
              {typeOfUser === 300 ? (
                <li id="nav-dashboard">
                  <Link to="/dashboard">Dashboard</Link>
                </li>
              ) : null}
            </ul>
          </nav>
        </div>
        <div className="nav-notifications">
          <select className="notifications-dropdown"
          onChange={handleNotificationSelect}
          >
            <option
              value="default"
              className="dropdown-notifications-defaultValue"
            >
              {notificationsCount} Notifications
            </option>
            {notificationsArray.map((notification, index) => (
              <option
                key={index}
                value={index}
                className="dropdown-notifications-otherValues"
              >
                <p>
                  You have {notification.count} messages from{" "}
                  {notification.sender}
                </p>
              </option>
            ))}
          </select>
        </div>
        <div className="nav-menu-right">
          <div className="link-edit-profile">
            <img src={photoURL} id="profile-pic" alt="profile-pic" />
            <p id="first-name-label" onClick={handleClick}>
              {firstName}
            </p>
          </div>
          <button
            className="logout-button"
            id="logout-button-header"
            onClick={processLogout}
          >
            <img src="/multimedia/logout.png" alt="logout-icon" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
