import React from "react";
import "../index.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Profile from "../components/Profile/Profile";
import Password from "../components/Password/Password";

function Home() {
  return (
    <div className="Home" id="home-outer-container">
      <div className="page-wrap" id="home-page-wrap">
        <div className="header-home-container">
          <Header />
        </div>
        <div className="aside-main-home-container">
          <div className="aside-home-container">
            <Password />
          </div>
          <div className="main-home-container">
            <Profile />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Home;
