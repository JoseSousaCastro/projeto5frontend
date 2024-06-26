import React from "react";
import "../index.css";
import Header from "../components/Header/Header";
import UsersAside from "../components/UsersAside/UsersAside";
import UsersMain from "../components/UsersMain/UsersMain";
import Footer from "../components/Footer/Footer";

function UsersList() {
  return (
    <div className="Home" id="home-outer-container">
      <div className="page-wrap" id="home-page-wrap">
        <div className="header-home-container">
          <Header />
        </div>
        <div className="aside-main-home-container">
          <div className="aside-home-container">
            <UsersAside />
          </div>
          <div className="main-home-container">
            <UsersMain />
          </div>
        </div>
        <div className="footer-home-container">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default UsersList;
