import React from "react";
import { userStore } from "../../stores/UserStore";
import { useNavigate } from "react-router-dom";
import "../DashboardAside/DashboardAside.css";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useState } from "react";

function DashboardAside() {
  const { t } = useTranslation();
  const users = userStore((state) => state.users);
  const navigate = useNavigate();
  const currentUser = userStore((state) => state.username);
  const token = userStore((state) => state.token);
  const [selectedTime, setSelectedTime] = useState("");

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

  const setTimeoutToken = async () => {
    const time = document.getElementById("select-timeout").value;
    console.log(time);
    try {
      const response = await fetch(
        `http://localhost:8080/project5/rest/users/setTokenTimeout/${time}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );
      if (response.ok) {
        toast.info(t("timeoutSet"));
        setSelectedTime("");
        console.log("Success");
      } else {
        console.error("Error setting timeout:", response.statusText);
      }
    }
    catch (error) {
      console.error("Error setting timeout:", error);
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
            value={selectedTime}
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
          <select
            className="dropdown-select-dashboard"
            id="select-timeout"
            onChange={setTimeoutToken}
          >
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
