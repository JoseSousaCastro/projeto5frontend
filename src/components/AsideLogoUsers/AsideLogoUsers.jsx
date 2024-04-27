import React from "react";
import "../AsideLogoUsers/AsideLogoUsers.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function AsideLogoUsers() {
  const { t } = useTranslation();

  return (
    <div className="aside-logo">
      <div className="div-back-users-list">
        <Link to="/users-list" className="link-to-users-list">
          {t("backToUsers")}
        </Link>
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

export default AsideLogoUsers;
