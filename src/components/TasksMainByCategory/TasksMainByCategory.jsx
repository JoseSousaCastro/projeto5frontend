import React from "react";
import "../TasksMainByCategory/TasksMainByCategory.css";
import { taskStore } from "../../stores/TaskStore";
import TaskCard from "../TaskCard/TaskCard";
import { userStore } from "../../stores/UserStore";
import { useNavigate, useParams } from "react-router-dom";

function TasksMainByCategory() {
  const navigate = useNavigate();
  const categoryURL = useParams().category;

  const tasks = taskStore((state) => state.tasks);
  const { fetchTasksByCategory } = taskStore();
  const token = userStore((state) => state.token);

  const erasedTasks = tasks.filter((task) => !task.erased);
  const categoryTasks = erasedTasks.filter(
    (task) => task.category.name === categoryURL
  );

  const todoTasks = categoryTasks.filter((task) => task.stateId === 100);
  const doingTasks = categoryTasks.filter((task) => task.stateId === 200);
  const doneTasks = categoryTasks.filter((task) => task.stateId === 300);

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
        console.log("Response:", responseBody);
        await fetchTasksByCategory(categoryURL);
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
        navigate(`/tasksbc/${categoryURL}`);
      } else {
        throw new Error("Failed to update task state");
      }
    } catch (error) {
      console.error("Error updating task state:", error);
    }
  }

  return (
    <div
      className="tasks-categories-list"
      id="tasks-categories-list-outer-container"
    >
      <div className="page-wrap-task-list" id="tasks-categories-list-page-wrap">
        <div className="task-section">
          <div className="titulo-main">
            <h2 className="main-home">To do</h2>
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
            <h2 className="main-home">Doing</h2>
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
            <h2 className="main-home">Done</h2>
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

export default TasksMainByCategory;
