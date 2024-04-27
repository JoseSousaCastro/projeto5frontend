import React, { useEffect, useState } from "react";
import "./UserProfileAside.css";
import { useParams } from "react-router-dom";
import { statsStore } from "../../stores/StatsStore";
import { userStore } from "../../stores/UserStore";
import { useTranslation } from "react-i18next";

function UserProfileAside() {
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(false);
  const { username } = useParams();
  const { fetchUserStats } = statsStore();
  const [websocketDashboard, setWebsocketDashboard] = useState(null);
  const [websocketMessageReceived, setWebsocketMessageReceived] = useState(
    false
  );
  const token = userStore((state) => state.token);

  useEffect(() => {
    if (!loaded) {
      fetchUserStats(username);
      setLoaded(true);
    }

    const websocket = new WebSocket(
      `ws://localhost:8080/project5/websocket/dashboard/${token}`
    );
    websocket.onopen = () => {
      console.log("Dashboard WebSocket connected");
      setWebsocketDashboard(() => websocket);
    };

    if (websocket) {
      websocket.onmessage = () => {
        fetchUserStats(username);
        setWebsocketMessageReceived(true);
      };
    }

    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [fetchUserStats, loaded, token, websocketMessageReceived, username]);

  const totalUserTasks = statsStore((state) => state.totalUserTasks);
  const totalUserToDoTasks = statsStore((state) => state.totalUserToDoTasks);
  const totalUserDoingTasks = statsStore((state) => state.totalUserDoingTasks);
  const totalUserDoneTasks = statsStore((state) => state.totalUserDoneTasks);

  return (
    <div className="stats-aside-div">
      <h1 className="stats-aside-title">{t("statsTitle")}</h1>
      <label className="stats-aside-labels">{t("totalTasksLabel")}</label>
      <p className="stats-aside-infos">{totalUserTasks}</p>
      <label className="stats-aside-labels">{t("toDoTasksLabel")}</label>
      <p className="stats-aside-infos">{totalUserToDoTasks}</p>
      <label className="stats-aside-labels">{t("doingTasksLabel")}</label>
      <p className="stats-aside-infos">{totalUserDoingTasks}</p>
      <label className="stats-aside-labels">{t("doneTasksLabel")}</label>
      <p className="stats-aside-infos">{totalUserDoneTasks}</p>
    </div>
  );
}

export default UserProfileAside;
