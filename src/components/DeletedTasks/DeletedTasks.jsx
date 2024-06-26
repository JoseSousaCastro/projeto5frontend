import React from "react";
import "../DeletedTasks/DeletedTasks.css";
import { taskStore } from "../../stores/TaskStore";
import TaskCard from "../TaskCard/TaskCard";
import { useTranslation } from "react-i18next";

function DeletedTasks() {
  const { t } = useTranslation();
  const tasks = taskStore((state) => state.tasks);

  const erasedTasks = tasks.filter((task) => task.erased);

  const todoTasks = erasedTasks.filter((task) => task.stateId === 100);
  const doingTasks = erasedTasks.filter((task) => task.stateId === 200);
  const doneTasks = erasedTasks.filter((task) => task.stateId === 300);

  return (
    <div className="tasks-users-list" id="tasks-users-list-outer-container">
      <div className="page-wrap-task-list-deleted" id="tasks-users-list-page-wrap">
        <div className="task-section">
          <div className="titulo-main">
            <h2 className="main-home">{t("todo")}</h2>
          </div>
          <div className="panel" id="todo">
            {todoTasks.map((task) => (
              <div className="task-card-taskMain" key={task.id}>
                <TaskCard task={task} />
              </div>
            ))}
          </div>
        </div>
        <div className="task-section">
          <div className="titulo-main">
            <h2 className="main-home">{t("doing")}</h2>
          </div>
          <div className="panel" id="doing">
            {doingTasks.map((task) => (
              <div className="task-card-taskMain" key={task.id}>
                <TaskCard task={task} />
              </div>
            ))}
          </div>
        </div>
        <div className="task-section">
          <div className="titulo-main">
            <h2 className="main-home">{t("done")}</h2>
          </div>
          <div className="panel" id="done">
            {doneTasks.map((task) => (
              <div className="task-card-taskMain" key={task.id}>
                <TaskCard task={task} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeletedTasks;
