import React from "react";
import "../TasksMainByUser/TasksMainByUser.css";
import { taskStore } from "../../stores/TaskStore";
import TaskCard from "../TaskCard/TaskCard";
import { userStore } from "../../stores/UserStore";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function TasksMainByUser() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const usernameURL = useParams().username;

  const tasks = taskStore((state) => state.tasks);
  const { fetchTasksByUser } = taskStore();
  const token = userStore((state) => state.token);

  const erasedTasks = tasks.filter((task) => !task.erased);
  const userTasks = erasedTasks.filter((task) => task.owner.username === usernameURL);

  const todoTasks = userTasks.filter((task) => task.stateId === 100);
  const doingTasks = userTasks.filter((task) => task.stateId === 200);
  const doneTasks = userTasks.filter((task) => task.stateId === 300);

  const setTasks = taskStore((state) => state.setTasks);
  const setTasksDoing = taskStore((state) => state.setTasksDoing);
  const setTasksDone = taskStore((state) => state.setTasksDone);

  async function handleTaskDrop(e, newStateId) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");

    try {
      const response = await fetch(
        `http://localhost:8080/project5/rest/users/tasks/${taskId}/${newStateId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

      if (response.ok) {
        const responseBody = await response.text();
        await fetchTasksByUser(usernameURL);

        // Adicione os toasts de acordo com o newStateId
        switch (newStateId) {
          case 100:
            toast.info(t("taskMovedToDo"));
            break;
          case 200:
            toast.info(t("taskMovedToDoing"));
            break;
          case 300:
            toast.info(t("taskMovedToDone"));
            break;
          default:
            break;
        }
        
        setTasks(
          taskStore
            .getState()
            .tasks.filter((task) => task.stateId === 100 && !task.erased)
        );
        setTasksDoing(
          taskStore
            .getState()
            .tasks.filter((task) => task.stateId === 200 && !task.erased)
        );
        setTasksDone(
          taskStore
            .getState()
            .tasks.filter((task) => task.stateId === 300 && !task.erased)
        );
        navigate(`/tasksbu/${usernameURL}`);
      } else {
        throw new Error(t("failedToUpdateTaskState"));
      }
    } catch (error) {
      console.error("Error updating task state:", error);
    }
  }

  return (
    <div className="tasks-users-list" id="tasks-users-list-outer-container">
      <div className="page-wrap-task-list" id="tasks-users-list-page-wrap">
        <div className="task-section">
          <div className="titulo-main">
            <h2 className="main-home">{t("todo")}</h2>
          </div>
          <div
            className="panel"
            id="todo"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleTaskDrop(e, 100)}
          >
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
          <div
            className="panel"
            id="doing"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleTaskDrop(e, 200)}
          >
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
          <div
            className="panel"
            id="done"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleTaskDrop(e, 300)}
          >
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

export default TasksMainByUser;
