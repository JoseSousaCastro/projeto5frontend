import React from "react";
import "../index.css";
import Header from "../components/Header/Header";
import AsideLogo from "../components/AsideLogo/AsideLogo";
import TasksMainByCategory from "../components/TasksMainByCategory/TasksMainByCategory";
import Footer from "../components/Footer/Footer";

function TasksByCategory() {
  return (
    <div className="Home" id="home-outer-container">
      <div className="page-wrap" id="home-page-wrap">
        <div className="header-home-container">
          <Header />
        </div>
        <div className="aside-main-home-container">
          <div className="aside-home-container">
            <AsideLogo />
          </div>
          <div className="main-home-container">
            <TasksMainByCategory />
          </div>
        </div>
        <div className="footer-home-container">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default TasksByCategory;
