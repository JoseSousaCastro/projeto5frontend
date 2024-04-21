import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Header/Header.css";
import { userStore } from "../../stores/UserStore";
import { websocketStore } from "../../stores/WebsocketStore";

function Header() {
  const navigate = useNavigate();
  const updateUserStore = userStore((state) => state);
  const websocket = websocketStore((state) => state.notificationSocket); // Obtendo a notificationSocket da websocketStore

  const firstName = userStore((state) => state.firstName);
  const photoURL = userStore((state) => state.photoURL);
  const typeOfUser = userStore((state) => state.typeOfUser);
  const token = userStore((state) => state.token);

  const [notificationsArray, setNotificationsArray] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);

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

  useEffect(() => {
    const handleFirstMessage = (event) => {
      const data = JSON.parse(event.data); // Convertendo a string JSON para um objeto JavaScript
      const notificationsArray = Object.entries(data).map(([key, value]) => ({
        sender: key, // String
        count: value, // Integer
      }));

      // Agora você tem um array onde cada elemento contém um par chave-valor da hashmap recebida
      // Você pode fazer o que quiser com esse array, como armazená-lo no estado ou exibi-lo na interface do usuário
      console.log(notificationsArray);
      setNotificationsArray(notificationsArray);
      setNotificationsCount(notificationsArray.length);

      // Removendo a função de manipulação de mensagem após processar a primeira mensagem
      websocket.removeEventListener('message', handleFirstMessage);
    };

    // Definindo a função de manipulação de mensagem para a primeira mensagem recebida
    if (websocket) {
      websocket.addEventListener('message', handleFirstMessage);
    }

    // Limpando o ouvinte de mensagem ao desmontar o componente
    return () => {
      if (websocket) {
        websocket.removeEventListener('message', handleFirstMessage);
      }
    };
  }, [websocket]);

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
          <select id="notifications-dropdown">
              <option value="default" className="dropdown-notifications-defaultValue">{notificationsCount} Notifications</option>
              {notificationsArray.map((notification, index) => (
                  <option key={index} value={index} className="dropdown-notifications-otherValues">
                  <p>You have {notification.count} messages from {notification.sender}</p>
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
