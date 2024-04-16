/* - Por cada utilizador, deverá ser possível consultar:
	- Contagem total de tarefas atribuídas a este utilizador
	- o Contagem do número de tarefas por estado (e.g. 5 em “DOING”, 2 em “DONE”, etc) */

import React, { useEffect, useState } from "react";
import { userStore } from "../../stores/UserStore";
import { taskStore } from "../../stores/TaskStore";
import { statsStore } from "../../stores/StatsStore";
import "../DashboardAside/DashboardAside.css";

function DashboardAside () {
	const users = userStore(state => state.users);
	const fetchUserStats = statsStore(state => state.fetchUserStats);

	const totalUserTasks = statsStore(state => state.totalUserTasks);
	const totalUserToDoTasks = statsStore(state => state.totalUserToDoTasks);
	const totalUserDoingTasks = statsStore(state => state.totalUserDoingTasks);
	const totalUserDoneTasks = statsStore(state => state.totalUserDoneTasks);

	const updateTotalUserTasks = statsStore(state => state.updateTotalUserTasks);
	const updatetotalUserToDoTasks = statsStore(state => state.updatetotalUserToDoTasks);
	const updatetotalUserDoingTasks = statsStore(state => state.updatetotalUserDoingTasks);
	const updatetotalUserDoneTasks = statsStore(state => state.updatetotalUserDoneTasks);


	const handleChange = (event) => {
		const username = event.target.value;
	}

	const handleClick = async () => {
		const selectedUsername = document.getElementById("select-user").value;
		console.log("selectedUsername", selectedUsername);
		if (selectedUsername) {
			await fetchUserStats(selectedUsername); // Chamando a função fetchUserStats com o username selecionado
			updateTotalUserTasks(totalUserTasks);
			updatetotalUserToDoTasks(totalUserToDoTasks);
			updatetotalUserDoingTasks(totalUserDoingTasks);
			updatetotalUserDoneTasks(totalUserDoneTasks);
		} else {
			console.error("Please select a user.");
		}
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
			<button className="dashboardAside-button" onClick={handleClick}>Show stats</button>
			<div className="user-tasks">
				<p className="dashboardAside-total">Total Tasks: {totalUserTasks}</p>
				<p className="dashboardAside-total-tasktype">To Do: {totalUserToDoTasks}</p>
				<p className="dashboardAside-total-tasktype">Doing: {totalUserDoingTasks}</p>
				<p className="dashboardAside-total-tasktype">Done: {totalUserDoneTasks}</p>
			</div>
		</div>
	</div>
	)

}

export default DashboardAside;