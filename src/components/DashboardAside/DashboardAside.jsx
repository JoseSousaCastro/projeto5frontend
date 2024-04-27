/* - Por cada utilizador, deverá ser possível consultar:
	- Contagem total de tarefas atribuídas a este utilizador
	- o Contagem do número de tarefas por estado (e.g. 5 em “DOING”, 2 em “DONE”, etc) */

import React from "react";
import { userStore } from "../../stores/UserStore";
import { useNavigate } from "react-router-dom";
import "../DashboardAside/DashboardAside.css";

function DashboardAside() {
  const users = userStore((state) => state.users);
  const navigate = useNavigate();
  const currentUser = userStore((state) => state.username);

  const handleChange = (event) => {
    const username = event.target.value;

    if (username === currentUser) {
      navigate("/edit-profile");
    } else if (username) {
      navigate(`/user-profile/${username}`);
    } else {
      console.error("Please select a user.");
    }
  };

  return (
    <div className="dashboardAside">
      <div className="dashboard-aside-container">
        <div className="dashboard-aside-users">
          <label>View task stats by user</label>
          <select
            className="dropdown-select-dashboard"
            id="select-user"
            onChange={handleChange}
          >
            <option value="" disabled selected>
              Select user
            </option>
            {users.map((user) => (
              <option key={user.username} value={user.username}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
        </div>
        <div className="dashboard-timeout">
          <label>Define idle period</label>
          <select className="dropdown-select-dashboard" id="select-timeout">
            <option value="" disabled selected>
              Select timeout
            </option>
            <option value="2">2 minutes</option>
            <option value="5">5 minutes</option>
            <option value="10">10 minutes</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default DashboardAside;
