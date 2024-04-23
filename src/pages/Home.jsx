import React, { useEffect, useState } from "react";
import "../index.css";
import Header from "../components/Header/Header";
import TasksAside from "../components/TasksAside/TasksAside";
import TasksMain from "../components/TasksMain/TasksMain";
import Footer from "../components/Footer/Footer";
import { userStore } from "../stores/UserStore";

function Home() {
  const [websocket, setWebsocket] = useState(null);
  const token = userStore((state) => state.token);

  useEffect(() => {
    const websocketTasks = new WebSocket(
      `ws://localhost:8080/project5/websocket/tasks/${token}`
    );
    setWebsocket(websocketTasks);

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
            <TasksAside websocket={websocket} />
          </div>
          <div className="main-home-container">
            <TasksMain websocket={websocket} />
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
