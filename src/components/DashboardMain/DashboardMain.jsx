/* - Contagem do número total de utilizadores
- Contagem do número de utilizadores confirmados e não confirmados
- Contagem do número médio de tarefas por utilizador
- Contagem do número de tarefas por estado (e.g. 5 em “DOING”, 2 em “DONE”, etc)
- Listagem das categorias, ordenada da mais frequente (mais tarefas) à menos frequente

- Tempo médio que uma tarefa demora até ser concluída (para fins de cálculo, considera-se como data de conclusão a última data em que a tarefa foi movida para “DONE”).
- Gráfico que mostre o número de utilizadores registados ao longo do tempo (e.g. gráfico de linhas). Os utilizadores apagados podem ser excluídos desta contagem.
- Gráfico cumulativo que mostre o número total de tarefas concluídas ao longo do tempo. Tarefas apagadas podem ser excluídas desta contagem.
*/

import React, { useEffect, useState } from "react";
import { userStore } from "../../stores/UserStore";
import { taskStore } from "../../stores/TaskStore";
import "../DashboardMain/DashboardMain.css";

function DashboardMain() {
    const users = userStore(state => state.users);
    const tasks = taskStore(state => state.tasks);
    const [userTasks, setUserTasks] = useState([]);
    const [userTasksToDo, setUserTasksToDo] = useState([]);
    const [userTasksDoing, setUserTasksDoing] = useState([]);
    const [userTasksDone, setUserTasksDone] = useState([]);
    const [userTasksTotal, setUserTasksTotal] = useState(0);
    const [userTasksToDoTotal, setUserTasksToDoTotal] = useState(0);
    const [userTasksDoingTotal, setUserTasksDoingTotal] = useState(0);
    const [userTasksDoneTotal, setUserTasksDoneTotal] = useState(0);

    const handleChange = (event) => {
        const username = event.target.value;
        const userTasks = tasks.filter(task => task.owner.name === username);
        const userTasksToDo = userTasks.filter(task => task.stateId === 100);
        const userTasksDoing = userTasks.filter(task => task.stateId === 200);
        const userTasksDone = userTasks.filter(task => task.stateId === 300);
        setUserTasksTotal(userTasks.length);
        setUserTasksToDoTotal(userTasksToDo.length);
        setUserTasksDoingTotal(userTasksDoing.length);
        setUserTasksDoneTotal(userTasksDone.length);
    }

    return (
        <div className="DashboardMain">
            <div className="dashboard-main-container">

            </div>
        </div>
    )

}

export default DashboardMain;