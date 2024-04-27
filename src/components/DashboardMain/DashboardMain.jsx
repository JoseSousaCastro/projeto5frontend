import React, { useEffect, useState } from "react";
import "../DashboardMain/DashboardMain.css";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { statsStore } from "../../stores/StatsStore";
import { userStore } from "../../stores/UserStore";
import { useTranslation } from "react-i18next";

function DashboardMain() {
  const [loaded, setLoaded] = useState(false);
  const { fetchGlobalStats } = statsStore();
  const [websocketDashboard, setWebsocketDashboard] = useState(null); // Estado para armazenar o WebSocket do dashboard
  const [websocketMessageReceived, setWebsocketMessageReceived] = useState(false);


  const token = userStore((state) => state.token);

  useEffect(() => {
    // Use fetchStats para buscar as estatísticas apenas uma vez após a montagem do componente
    if (!loaded) {
      fetchGlobalStats();
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
        fetchGlobalStats();
        setWebsocketMessageReceived(true);
      };
    }
    
    // Retornar uma função de limpeza para remover o listener quando o componente for desmontado
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [fetchGlobalStats, loaded, token, websocketMessageReceived]);
  

  const totalUsers = statsStore((state) => state.totalUsers);
  const totalConfirmedUsers = statsStore((state) => state.totalConfirmedUsers);
  const totalUnconfirmedUsers = statsStore(
    (state) => state.totalUnconfirmedUsers
  );
  const usersOverTime = statsStore((state) => state.usersOverTime);

  const totalToDoTasks = statsStore((state) => state.totalToDoTasks);
  const totalDoingTasks = statsStore((state) => state.totalDoingTasks);
  const totalDoneTasks = statsStore((state) => state.totalDoneTasks);
  const tasksCompletedOverTime = statsStore(
    (state) => state.tasksCompletedOverTime
  );

  const tasksPerUser = statsStore((state) => state.tasksPerUser);
  const averageTaskTime = statsStore((state) => state.averageTaskTime);

  const categoriesListDesc = statsStore((state) => state.categoriesListDesc);
  console.log("categoriesListDesc", categoriesListDesc);

  // Convertendo a lista para o formato compatível com o gráfico e ordenando os dados pela data
  const formattedDataUsers = usersOverTime
    .map((info) => ({
      name: `${info.month}/${info.year}`, // Formatando a data como MM/AAAA
      users: info.count, // Número de tarefas concluídas
    }))
    .sort((a, b) => {
      const [aMonth, aYear] = a.name.split("/");
      const [bMonth, bYear] = b.name.split("/");
      const aDate = new Date(parseInt(aYear), parseInt(aMonth) - 1);
      const bDate = new Date(parseInt(bYear), parseInt(bMonth) - 1);
      return aDate - bDate;
    });
  console.log("formattedDataUsers", formattedDataUsers);

  // Convertendo a lista para o formato compatível com o gráfico e ordenando os dados pela data
  let cumulativeTasks = 0;
  const formattedDataTasks = tasksCompletedOverTime
    .map((info) => {
      cumulativeTasks += info.count;
      return {
        name: `${info.month}/${info.year}`, // Formatando a data como MM/AAAA
        tasks: cumulativeTasks, // Número total de tarefas concluídas até o momento
      };
    })
    .sort((a, b) => {
      const [aMonth, aYear] = a.name.split("/");
      const [bMonth, bYear] = b.name.split("/");
      const aDate = new Date(parseInt(aYear), parseInt(aMonth) - 1);
      const bDate = new Date(parseInt(bYear), parseInt(bMonth) - 1);
      return aDate - bDate;
    });
  console.log("formattedDataTasks", formattedDataTasks);

  return (
    <div className="DashboardMain">
      <div className="dashboard-main-container">
        <h2 className="stats-h2">Statistics</h2>
        <div className="users-stats">
          <div className="users-stats-left">
            <div className="users-stats-div-total-users">
              <label className="users-stats-labels-titles">Total Users: </label>
              <label className="users-stats-labels-values">{totalUsers}</label>
            </div>
            <div className="users-stats-div-confirmed-users">
              <label className="users-stats-labels-titles">
                Confirmed Users:
              </label>
              <label className="users-stats-labels-values">
                {totalConfirmedUsers}
              </label>
            </div>
            <div className="users-stats-div-unconfirmed-users">
              <label className="users-stats-labels-titles">
                Unconfirmed Users:
              </label>
              <label className="users-stats-labels-values">
                {totalUnconfirmedUsers}
              </label>
            </div>
          </div>
          <div className="users-stats-right">
            <label>Users</label>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                width={300}
                height={100}
                data={formattedDataUsers}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="users"
                  stackId="1"
                  stroke="#223C4A"
                  fill="#21979c"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="tasks-stats">
          <div className="tasks-stats-left">
            <div className="tasks-stats-div-total-todoTasks">
              <label className="tasks-stats-labels-titles">
                Total To Do Tasks:
              </label>
              <label className="tasks-stats-labels-values">
                {totalToDoTasks}
              </label>
            </div>
            <div className="tasks-stats-div-total-doingTasks">
              <label className="tasks-stats-labels-titles">
                Total Doing Tasks:
              </label>
              <label className="tasks-stats-labels-values">
                {totalDoingTasks}
              </label>
            </div>
            <div className="tasks-stats-div-total-doneTasks">
              <label className="tasks-stats-labels-titles">
                Total Done Tasks:
              </label>
              <label className="tasks-stats-labels-values">
                {totalDoneTasks}
              </label>
            </div>
            <div className="tasks-stats-div-tasksPerUser">
              <label className="tasks-stats-labels-titles">
                Average Tasks Per User:
              </label>
              <label className="tasks-stats-labels-values">
                {tasksPerUser}
              </label>
            </div>
            <div className="tasks-stats-div-averageTaskTime">
              <label className="tasks-stats-labels-titles">
                Average Task Time:
              </label>
              <label className="tasks-stats-labels-values">
                {averageTaskTime}
              </label>
            </div>
          </div>
          <div className="tasks-stats-right">
            <label>Completed Tasks</label>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                width={300}
                height={100}
                data={formattedDataTasks}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="tasks"
                  stackId="1"
                  stroke="#223C4A"
                  fill="#2CCCD3"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="categories-stats">
          <label className="categories-stats-label">Categories:</label>
          <ul className="categories-list">
            {categoriesListDesc.map((item, index) => (
              <li className="categories-stats-li" key={index}>
                <span className="categories-stats-span-left">
                  {item.category}
                </span>
                :{" "}
                <span className="categories-stats-span-right">
                  {item.quantity}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DashboardMain;
