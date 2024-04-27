import React from "react";
import { userStore } from "../../stores/UserStore";
import { useNavigate } from "react-router-dom";
import "../DashboardAside/DashboardAside.css";
import { useTranslation } from "react-i18next";

function DashboardAside() {
  const { t } = useTranslation();
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
      console.error(t("selectUserError"));
    }
  };

  return (
    <div className="dashboardAside">
      <div className="dashboard-aside-container">
        <div className="dashboard-aside-users">
          <label>{t("viewTaskStats")}</label>
          <select
            className="dropdown-select-dashboard"
            id="select-user"
            onChange={handleChange}
          >
            <option value="" disabled selected>
              {t("selectUser")}
            </option>
            {users.map((user) => (
              <option key={user.username} value={user.username}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
        </div>
        <div className="dashboard-timeout">
          <label>{t("defineIdlePeriod")}</label>
          <select className="dropdown-select-dashboard" id="select-timeout">
            <option value="" disabled selected>
              {t("selectTimeout")}
            </option>
            <option value="2">{t("twoMinutes")}</option>
            <option value="5">{t("fiveMinutes")}</option>
            <option value="10">{t("tenMinutes")}</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default DashboardAside;
