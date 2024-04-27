import React from "react";
import "./UserProfileAside.css";
import { useParams } from "react-router-dom";
import { statsStore } from "../../stores/StatsStore";
import { userStore } from "../../stores/UserStore";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function UserProfileAside() {
  const [loaded, setLoaded] = useState(false);
  const { username } = useParams();
  const { fetchUserStats } = statsStore();
  const [websocketDashboard, setWebsocketDashboard] = useState(null); // Estado para armazenar o WebSocket do dashboard
  const [websocketMessageReceived, setWebsocketMessageReceived] = useState(false);
  const token = userStore((state) => state.token);


  useEffect(() => {
    // Use fetchStats para buscar as estatísticas apenas uma vez após a montagem do componente
    if (!loaded) {
      fetchUserStats(username);
      setLoaded(true);
    }
  
    // Criação do WebSocket quando o componente monta
    const websocket = new WebSocket(
      `ws://localhost:8080/project5/websocket/dashboard/${token}`
    );
    websocket.onopen = () => {
      console.log("Dashboard WebSocket connected");
      setWebsocketDashboard(() => websocket); // Usando um callback para garantir que o WebSocket seja definido apenas uma vez
    };
  
    // Adicionando o listener apenas se o WebSocket estiver definido
    if (websocket) {
      websocket.onmessage = () => {
        fetchUserStats(username);
        setWebsocketMessageReceived(true);
      };
    }
    
    // Retornar uma função de limpeza para remover o listener quando o componente for desmontado
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
      <h1 className="stats-aside-title">Stats</h1>
      <label className="stats-aside-labels">Total tasks</label>
      <p className="stats-aside-infos">{totalUserTasks}</p>
      <label className="stats-aside-labels">To do tasks</label>
      <p className="stats-aside-infos">{totalUserToDoTasks}</p>
      <label className="stats-aside-labels">Doing tasks</label>
      <p className="stats-aside-infos">{totalUserDoingTasks}</p>
      <label className="stats-aside-labels">Done tasks</label>
      <p className="stats-aside-infos">{totalUserDoneTasks}</p>
    </div>
  );
}

export default UserProfileAside;
