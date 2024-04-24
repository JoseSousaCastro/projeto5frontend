import React, { useEffect, useState } from "react";
import "../index.css";
import Header from "../components/Header/Header";
import AsideLogo from "../components/AsideLogo/AsideLogo";
import TasksMainByCategory from "../components/TasksMainByCategory/TasksMainByCategory";
import Footer from "../components/Footer/Footer";
import { userStore } from "../stores/UserStore";
import { taskStore } from "../stores/TaskStore";

function TasksByCategory() {
  const [websocket, setWebsocket] = useState(null);
  const token = userStore((state) => state.token);
  const fetchTasks = taskStore((state) => state.fetchTasks);

  useEffect(() => {
    const websocketTasks = new WebSocket(
      `ws://localhost:8080/project5/websocket/tasks/${token}`
    );
    setWebsocket(websocketTasks);

    websocketTasks.onmessage = (event) => {
      console.log("TasksAddTask - onmessage", event.data);
      fetchTasks();
    };

    return () => {
      if (websocketTasks) {
        websocketTasks.close();
      }
    };
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
