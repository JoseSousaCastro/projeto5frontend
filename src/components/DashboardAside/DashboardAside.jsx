/* - Por cada utilizador, deverá ser possível consultar:
	- Contagem total de tarefas atribuídas a este utilizador
	- o Contagem do número de tarefas por estado (e.g. 5 em “DOING”, 2 em “DONE”, etc) */

import React, { useEffect, useState } from "react";
import { userStore } from "../../stores/UserStore";
import { taskStore } from "../../stores/TaskStore";
import "../DashboardAside/DashboardAside.css";

function DashboardAside () {
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
	<div className="dashboardAside">
		<div className="dashboard-aside-container">
			<label>Task stats by user</label>
			<select className="dropdown-select-dashboard" id="select-user" onChange={handleChange}>
				<option value="" disabled selected>Select user</option>
				{users.map((user) => (
					<option key={user.username} value={user.username}>{user.firstName} {user.lastName}</option>
				))}
			</select>
			<div className="user-tasks">
				<p className="dashboardAside-total">Total Tasks: {userTasksTotal}</p>
				<p className="dashboardAside-total-tasktype">To Do: {userTasksToDoTotal}</p>
				<p className="dashboardAside-total-tasktype">Doing: {userTasksDoingTotal}</p>
				<p className="dashboardAside-total-tasktype">Done: {userTasksDoneTotal}</p>
			</div>
		</div>
	</div>
	)

}

export default DashboardAside;