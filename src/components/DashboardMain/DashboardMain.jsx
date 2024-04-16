/*
-----USERS-----
- Contagem do número total de utilizadores (label com o valor)
- Contagem do número de utilizadores confirmados e não confirmados (label com o valor)
- Gráfico que mostre o número de utilizadores registados ao longo do tempo (e.g. gráfico de linhas). Os utilizadores apagados podem ser excluídos desta contagem.
(Synchronized Area Chart - users apagados no de baixo)

-----TASKS-----
- Contagem do número de tarefas por estado (e.g. 5 em “DOING”, 2 em “DONE”, etc) (labels com o valor)
- Gráfico cumulativo que mostre o número total de tarefas concluídas ao longo do tempo. Tarefas apagadas podem ser excluídas desta contagem.
(Synchronized Area Chart - tarefas apagadas no de baixo)
- Contagem do número médio de tarefas por utilizador (label com o valor)
- Tempo médio que uma tarefa demora até ser concluída (data de conclusão é a última data em que a tarefa foi movida para “DONE”). (label com o valor)

-----CATEGORIES-----
- Listagem das categorias, ordenada da mais frequente (mais tarefas) à menos frequente


*/

import React, { useEffect, useState, PureComponent } from "react";
import "../DashboardMain/DashboardMain.css";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { statsStore } from "../../stores/StatsStore";


function DashboardMain() {
    const [loaded, setLoaded] = useState(false);
    const { fetchGlobalStats } = statsStore();

    const data = 0;

    useEffect(() => {
        // Use fetchStats para buscar as estatísticas apenas uma vez após a montagem do componente
        if (!loaded) {
            fetchGlobalStats();
            setLoaded(true);
        }
    }, [fetchGlobalStats, loaded]);

    const totalUsers = statsStore(state => state.totalUsers);
    const totalConfirmedUsers = statsStore(state => state.totalConfirmedUsers);
    const totalUnconfirmedUsers = statsStore(state => state.totalUnconfirmedUsers);
    const usersOverTime = statsStore(state => state.usersOverTime);
    console.log("totalUsers", totalUsers);
    console.log("totalConfirmedUsers", totalConfirmedUsers);
    console.log("totalUnconfirmedUsers", totalUnconfirmedUsers);
    console.log("usersOverTime", usersOverTime);

    const totalToDoTasks = statsStore(state => state.totalToDoTasks);
    const totalDoingTasks = statsStore(state => state.totalDoingTasks);
    const totalDoneTasks = statsStore(state => state.totalDoneTasks);
    const tasksCompletedOverTime = statsStore(state => state.tasksCompletedOverTime);
    console.log("totalToDoTasks", totalToDoTasks);
    console.log("totalDoingTasks", totalDoingTasks);
    console.log("totalDoneTasks", totalDoneTasks);
    console.log("tasksCompletedOverTime", tasksCompletedOverTime);

    const tasksPerUser = statsStore(state => state.tasksPerUser);
    const averageTaskTime = statsStore(state => state.averageTaskTime);
    console.log("tasksPerUser", tasksPerUser);
    console.log("averageTaskTime", averageTaskTime);

    const categoriesListDesc = statsStore(state => state.categoriesListDesc);
    console.log("categoriesListDesc", categoriesListDesc);

    return (
        <div className="DashboardMain">
            <div className="dashboard-main-container">
                <h2 className="stats-h2">Statistics</h2>
                <div className="users-stats">
                    <div className="users-stats-left">
                        <label className="users-stats-labels-titles">Total Users: </label><label className="users-stats-labels-values">{totalUsers}</label>
                        <label className="users-stats-labels-titles">Confirmed Users:</label><label className="users-stats-labels-values">{totalConfirmedUsers}</label>
                        <label className="users-stats-labels-titles">Unconfirmed Users:</label><label className="users-stats-labels-values">{totalUnconfirmedUsers}</label>
                    </div>
                    <div className="users-stats-right">
                        <label>Users</label>
                            <ResponsiveContainer width="100%" height={200}>
                                <AreaChart
                                    width={300}
                                    height={100}
                                    data={usersOverTime}
                                    margin={{
                                        top: 10, right: 30, left: 0, bottom: 0,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Area type="monotone" dataKey="users" stackId="1" stroke="#223C4A" fill="#223C4A" />
                                </AreaChart>
                            </ResponsiveContainer>
                    </div>
                </div>
                <div className="tasks-stats">
                    <div className="tasks-stats-left">
                        <label className="tasks-stats-labels-titles">Total To Do Tasks:</label><label className="tasks-stats-labels-values">{totalToDoTasks}</label>
                        <label className="tasks-stats-labels-titles">Total Doing Tasks:</label><label className="tasks-stats-labels-values">{totalDoingTasks}</label>
                        <label className="tasks-stats-labels-titles">Total Done Tasks:</label><label className="tasks-stats-labels-values">{totalDoneTasks}</label>
                        <label className="tasks-stats-labels-titles">Average Tasks Per User:</label><label className="tasks-stats-labels-values">{tasksPerUser}</label>
                        <label className="tasks-stats-labels-titles">Average Task Time:</label><label className="tasks-stats-labels-values">{averageTaskTime}</label>
                    </div>
                    <div className="tasks-stats-right">
                        <label>Completed Tasks:</label>
                            <ResponsiveContainer width="100%" height={200}>
                                <AreaChart
                                    width={300}
                                    height={100}
                                    data={tasksCompletedOverTime}
                                    margin={{
                                        top: 10, right: 30, left: 0, bottom: 0,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Area type="monotone" dataKey="tasks" stackId="1" stroke="#223C4A" fill="#223C4A" />
                                </AreaChart>
                            </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default DashboardMain;