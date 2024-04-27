import React from "react";
import "../Footer/Footer.css";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();

  return (
    <div className="footer-home-container">
      <div className="footer" id="footer-outer-container">
        <div className="page-wrap" id="footer-page-wrap">
          <p>
            &copy; José Sousa Castro &nbsp; | &nbsp; {t("javaProgramming")} &nbsp; | &nbsp; {t("project5")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
