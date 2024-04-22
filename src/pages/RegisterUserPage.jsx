import React from "react";
import "../index.css";
import Header from "../components/Header/Header";
import RegisterUser from "../components/RegisterUser/RegisterUser";
import Footer from "../components/Footer/Footer";
import AsideLogoUsers from "../components/AsideLogoUsers/AsideLogoUsers";

function RegisterUserPage() {
  return (
    <div className="Home" id="home-outer-container">
      <div className="page-wrap" id="home-page-wrap">
        <div className="header-home-container">
          <Header />
        </div>
        <div className="aside-main-home-container">
          <div className="aside-home-container">
            <AsideLogoUsers />
          </div>
          <div className="main-home-container">
            <RegisterUser />
          </div>
        </div>
        <div className="footer-home-container">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default RegisterUserPage;
