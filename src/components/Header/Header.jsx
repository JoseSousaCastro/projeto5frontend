import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Header/Header.css";
import { userStore } from "../../stores/UserStore";
import { websocketStore } from "../../stores/WebsocketStore";

function Header() {
  const navigate = useNavigate();
  const updateUserStore = userStore((state) => state);
  const [notificationsArray, setNotificationsArray] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [notificationCounts, setNotificationCounts] = useState({});
  const [selectedOption, setSelectedOption] = useState("default");

  const [websocket, setWebsocket] = useState(null);

  const firstName = userStore((state) => state.firstName);
  const photoURL = userStore((state) => state.photoURL);
  const typeOfUser = userStore((state) => state.typeOfUser);
  const token = userStore((state) => state.token);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/project5/rest/users/getAllNotifications`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );
      if (response.ok) {
        const notifications = await response.json();
        console.log("Notifications:", notifications);
        processNotifications(notifications);
      } else {
        console.error("Failed to fetch notifications:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const processNotifications = (notifications) => {
    const newNotificationCounts = {};
    const newUnreadCounts = {};

    // Iterar sobre as notificações para contar e armazenar as contagens
    notifications.forEach((notification) => {
      const { senderUsername, read } = notification;

      // Contar as notificações por senderUsername
      newNotificationCounts[senderUsername] =
        (newNotificationCounts[senderUsername] || 0) + 1;

      // Contar as notificações não lidas por senderUsername
      if (!read) {
        newUnreadCounts[senderUsername] =
          (newUnreadCounts[senderUsername] || 0) + 1;
      }
    });

    // Atualizar o estado local com as contagens de notificações
    setNotificationCounts(newNotificationCounts);
    setUnreadCounts(newUnreadCounts);

    // Calcular o total de senderUsername com pelo menos uma notificação não lida
    const unreadSenderUsernames = Object.keys(newUnreadCounts);
    const totalSenderUsernamesWithUnreadNotifications =
      unreadSenderUsernames.length;

    // Definir o total de notificações não lidas
    setNotificationsCount(totalSenderUsernamesWithUnreadNotifications);
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
        // Atualizar contadores ao receber uma nova mensagem
        setNotificationsArray((prevNotifications) => {
          const existingNotificationIndex = prevNotifications.findIndex(
            (notification) => notification.sender === senderUsername
          );
          if (existingNotificationIndex !== -1) {
            // Se o remetente já estiver na lista de notificações, atualize os contadores
            const updatedNotifications = [...prevNotifications];
            updatedNotifications[existingNotificationIndex].count += 1;
            return updatedNotifications;
          } else {
            // Se o remetente ainda não estiver na lista de notificações, adicione-o
            return [...prevNotifications, { sender: senderUsername, count: 1 }];
          }
        });
        setNotificationsCount((prevCount) => prevCount + 1); // Incrementar a contagem total de notificações
      };
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

  const handleSelectChange = async (event) => {
    const senderUsername = event.target.value;
    console.log("Selected sender:", senderUsername);
    setSelectedOption(senderUsername);
    console.log("token", token);

    // Marcar notificações como lidas
    try {
      const response = await fetch(
        `http://localhost:8080/project5/rest/users/markNotificationsAsRead/${senderUsername}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );
      const data = await response.text();
      console.log("Response:", data);
      if (!response.ok) {
        console.error(
          "Failed to mark notifications as read:",
          response.statusText
        );
      } else {
        console.log("Notifications marked as read for sender:", senderUsername);
        // Atualizar contadores após marcar as notificações como lidas
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }

    // Redirecionar para a página do perfil do usuário selecionado
    navigate(`/user-profile/${senderUsername}`);
  };

  // Adicione uma função para determinar a classe com base nas condições
  const getOptionClassName = (unreadCount, notificationCount) => {
    if (unreadCount === 0 && notificationCount > 0) {
      return "notifications-dropdown";
    } else if (unreadCount > 0 && notificationCount > 0) {
      return "bold-green3"; // Classe a ser definida no CSS com os estilos específicos
    } else {
      return ""; // Se nenhuma condição for atendida, não aplique nenhuma classe
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
          <select
            className="notifications-dropdown"
            value={selectedOption}
            onChange={handleSelectChange}
          >
            <option
              value="default"
              className="dropdown-notifications-defaultValue"
            >
              {notificationsCount} Notifications
            </option>
            {Object.keys(notificationCounts).map((senderUsername) => (
              <option
                key={senderUsername}
                value={senderUsername}
                className={getOptionClassName(
                  unreadCounts[senderUsername] || 0,
                  notificationCounts[senderUsername]
                )}
              >
                {unreadCounts[senderUsername] || 0} /{" "}
                {notificationCounts[senderUsername]} unread messages from{" "}
                {senderUsername}
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
