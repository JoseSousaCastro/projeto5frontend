import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Header/Header.css";
import { userStore } from "../../stores/UserStore";
import { websocketStore } from "../../stores/WebsocketStore";

function Header() {
  const navigate = useNavigate();
  const updateUserStore = userStore((state) => state);
  const websocket = websocketStore((state) => state.notificationSocket); // Obtendo o WebSocket da websocketStore
  const notificationsArray = websocketStore((state) => state.notificationArray); // Obtendo o array de notificações da websocketStore
  const notificationsCount = websocketStore((state) => state.getNotificationArrayLength()); // Obtendo o comprimento do array de notificações da websocketStore

  console.log("notificationsArray", notificationsArray);
  console.log("notificationsCount", notificationsCount);

  const firstName = userStore((state) => state.firstName);
  const photoURL = userStore((state) => state.photoURL);
  const typeOfUser = userStore((state) => state.typeOfUser);
  const token = userStore((state) => state.token);

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

        // Limpar o WebSocket
        if (websocket) {
          websocket.close();
          websocketStore.getState().setNotificationSocket(null);
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
          <select className="notifications-dropdown">
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
