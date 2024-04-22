import React from "react";
import "../TaskCard/TaskCard.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../stores/UserStore";
import { taskStore } from "../../stores/TaskStore";
import deleteIcon from "/AoR/42.Projeto5/projeto5frontend/projeto5frontend/src/dark-cross.png";
import restoreIcon from "/AoR/42.Projeto5/projeto5frontend/projeto5frontend/src/reload.png";

export default function TaskCard({ task }) {
  const navigate = useNavigate();
  const { fetchTasks } = taskStore();
  const taskId = task.id;
  const { id, title, description, priority, erased } = task;
  const token = userStore((state) => state.token);
  const typeOfUser = userStore((state) => state.typeOfUser);

  // Traduzindo a prioridade de int para string
  const translatePriority = (priorityInt) => {
    switch (priorityInt) {
      case 100:
        return "Low";
      case 200:
        return "Medium";
      case 300:
        return "High";
      default:
        return "";
    }
  };

  const priorityString = translatePriority(priority);

  const getPriorityBorderClass = () => {
    switch (priorityString) {
      case "High":
        return "border-red";
      case "Medium":
        return "border-yellow";
      case "Low":
        return "border-green";
      default:
        return "";
    }
  };

  const priorityBorderClass = getPriorityBorderClass();

  const handleEraseTask = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/project5/rest/users/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

      if (response.ok) {
        await fetchTasks();
        navigate("/tasks-deleted", { replace: true });
      } else {
        const responseBody = await response.text();
        console.error(
          "Error deleting task:",
          response.statusText,
          responseBody
        );
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleDeleteTask = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/project5/rest/users/delete/${taskId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

      if (response.ok) {
        await fetchTasks();
        navigate("/home", { replace: true });
      } else {
        const responseBody = await response.text();
        console.error(
          "Error deleting task:",
          response.statusText,
          responseBody
        );
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleRestoreTask = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/project5/rest/users/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

      if (response.ok) {
        await fetchTasks();
        navigate("/home", { replace: true });
      } else {
        const responseBody = await response.text();
        console.error(
          "Error deleting task:",
          response.statusText,
          responseBody
        );
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", task.id);
      }}
      className={`task ${priorityBorderClass}`}
      style={{ backgroundColor: erased ? "#EDEDED" : "white" }}
    >
      {erased ? (
        <div className="task-title-solo task-title-solo-erased">{title}</div>
      ) : (
        <Link to={`/edit-task/${id}`} className="task-title-solo">
          {title}
        </Link>
      )}
      <div className="task-description-solo">{description}</div>
      {erased ? (
        <div className="task-del-restore">
          {(typeOfUser === 300 || typeOfUser === 200) && (
            <div className="task-restore">
              <img
                src={restoreIcon}
                alt="Restore"
                className="restore-icon"
                onClick={handleRestoreTask}
              />
            </div>
          )}
          {typeOfUser === 300 && (
            <div className="task-delete">
              <img
                src={deleteIcon}
                alt="Delete"
                className="delete-icon"
                onClick={handleDeleteTask}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="task-erase">
          {(typeOfUser === 300 || typeOfUser === 200) && (
            <img
              src={deleteIcon}
              alt="Erase"
              className="erase-icon"
              onClick={handleEraseTask}
            />
          )}
        </div>
      )}
    </div>
  );
}
