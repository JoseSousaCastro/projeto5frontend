import React from "react";
import "../AsideLogo/AsideLogo.css";
import { useNavigate } from "react-router-dom";
import { taskStore } from "../../stores/TaskStore";
import { useTranslation } from "react-i18next";

function AsideLogo() {
  const navigate = useNavigate();
  const { fetchTasks } = taskStore();
  const { t } = useTranslation();

  const handleBackToHome = async () => {
    await fetchTasks();
    navigate("/home");
  };

  return (
    <div className="aside-logo">
      <div className="div-back-home">
        <p to="/home" className="link-to-home" onClick={handleBackToHome}>
          {t("backToTasks")}
        </p>
      </div>
      <img
        src="/multimedia/symbol-05.png"
        id="logo-aside"
        width="220"
        alt="Agile-Scrum-logo"
      />
    </div>
  );
}

export default AsideLogo;
