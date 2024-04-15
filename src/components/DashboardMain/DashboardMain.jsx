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


function DashboardMain() {


    return (
        <div className="DashboardMain">
            <div className="dashboard-main-container">
                <label>Statistics</label>
                <div className="users-stats">
                    <div className="users-stats-total-users">
                        <label>Total Users:</label>
                        <p>0</p>
                    </div>
                    <div className="users-stats-confirmed-users">
                        <label>Confirmed Users:</label>
                        <p>0</p>
                    </div>
                    <div className="users-stats-unconfirmed-users">
                        <label>Unconfirmed Users:</label>
                        <p>0</p>
                    </div>
                    <div className="users-stats-users-over-time">
                        <label>Users</label>
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart
                                width={500}
                                height={200}
                                data={data}
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
                    <div className="tasks-stats-total-todo-tasks">
                        <label>Total To Do Tasks:</label>
                        <p>0</p>
                    </div>
                    <div className="tasks-stats-total-doing-tasks">
                        <label>Total Doing Tasks:</label>
                        <p>0</p>
                    </div>
                    <div className="tasks-stats-total-done-tasks">
                        <label>Total Done Tasks:</label>
                        <p>0</p>
                    </div>
                    <div className="tasks-stats-tasks-per-user">
                        <label>Average Tasks Per User:</label>
                        <p>0</p>
                    </div>
                    <div className="tasks-stats-average-task-time">
                        <label>Average Task Time:</label>
                        <p>0</p>
                    </div>
                    <div className="tasks-stats-tasks-over-time">
                        <label>Completed Tasks:</label>
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart
                                width={500}
                                height={200}
                                data={data}
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