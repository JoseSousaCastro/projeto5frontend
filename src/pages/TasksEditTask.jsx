import React, { useEffect, useState } from "react";
import "../index.css";
import Header from "../components/Header/Header";
import EditTask from "../components/EditTask/EditTask";
import Footer from "../components/Footer/Footer";
import AsideLogo from "../components/AsideLogo/AsideLogo";
import { taskStore } from "../stores/TaskStore";
import { useParams } from "react-router-dom";
import { userStore } from "../stores/UserStore";

function TasksEditTask() {
  const { taskId } = useParams();
  const task = taskStore((state) =>
    state.tasks.find((task) => task.id === taskId)
  );
  const fetchTasks = taskStore((state) => state.fetchTasks);

  const [websocket, setWebsocket] = useState(null);
  const token = userStore((state) => state.token);

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
            <EditTask task={task} />
          </div>
        </div>
        <div className="footer-home-container">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default TasksEditTask;
