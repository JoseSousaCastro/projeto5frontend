import React, { useEffect, useState } from "react";
import "../index.css";
import Header from "../components/Header/Header";
import AddTask from "../components/AddTask/AddTask";
import Footer from "../components/Footer/Footer";
import AsideLogo from "../components/AsideLogo/AsideLogo";
import { userStore } from "../stores/UserStore";


function TasksAddTask() {
  const [websocket, setWebsocket] = useState(null);
  const token = userStore((state) => state.token);

  useEffect(() => {
    const websocketTasks = new WebSocket(`ws://localhost:8080/project5/websocket/tasks/${token}`);
    setWebsocket(websocketTasks);
  }, [token]);

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
            <AddTask />
          </div>
        </div>
        <div className="footer-home-container">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default TasksAddTask;
