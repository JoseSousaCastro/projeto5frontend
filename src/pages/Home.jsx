import React, { useEffect, useState } from "react";
import "../index.css";
import Header from "../components/Header/Header";
import TasksAside from "../components/TasksAside/TasksAside";
import TasksMain from "../components/TasksMain/TasksMain";
import Footer from "../components/Footer/Footer";
import { userStore } from "../stores/UserStore";
import { taskStore } from "../stores/TaskStore";

function Home() {
  const [websocket, setWebsocket] = useState(null);
  const token = userStore((state) => state.token);
  const fetchTasks = taskStore((state) => state.fetchTasks);

  useEffect(() => {
    const websocketTasks = new WebSocket(
      `ws://localhost:8080/project5/websocket/tasks/${token}`
    );
    console.log("Home - useEffect - websocketTasks", websocketTasks);
    setWebsocket(websocketTasks);

    websocketTasks.onmessage = async (event) => {
      console.log("TasksAddTask - onmessage", event.data);
      await fetchTasks();
    };

    return () => {
      console.log("Home - useEffect - return to close websocketTasks");
      if (websocketTasks) {
        console.log("Home - useEffect - close websocketTasks");
        websocketTasks.close();
      }
    };
  }, []);

  return (
    <div className="Home" id="home-outer-container">
      <div className="page-wrap" id="home-page-wrap">
        <div className="header-home-container">
          <Header />
        </div>
        <div className="aside-main-home-container">
          <div className="aside-home-container">
            <TasksAside />
          </div>
          <div className="main-home-container">
            <TasksMain />
          </div>
        </div>
        <div className="footer-home-container">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Home;
