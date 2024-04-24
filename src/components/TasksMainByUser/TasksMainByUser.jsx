import React, { useEffect, useState } from "react";
import "../TasksMainByUser/TasksMainByUser.css";
import { taskStore } from "../../stores/TaskStore";
import TaskCard from "../TaskCard/TaskCard";
import { userStore } from "../../stores/UserStore";
import { useNavigate, useParams } from "react-router-dom";

function TasksMainByUser() {
  // Utilize o hook useState para inicializar as tarefas
  const [tasks, setTasks] = useState([]);
  const [tasksDoing, setTasksDoing] = useState([]);
  const [tasksDone, setTasksDone] = useState([]);
  const { fetchTasksByUser } = taskStore();
  const usernameURL = useParams().username;
  const navigate = useNavigate();

  console.log("usernameURL", usernameURL);

  const token = userStore((state) => state.token);

  useEffect(() => {

    // Use uma função para acessar o estado atual da taskStore
    const tasksFromStore = taskStore.getState().tasks;

    // Filtre as tarefas cujo atributo erased seja false
    const filteredTasks = tasksFromStore.filter((task) => !task.erased);

    // Filtre as tarefas de acordo com o stateId
    const todoTasks = filteredTasks.filter((task) => task.stateId === 100);
    const doingTasks = filteredTasks.filter((task) => task.stateId === 200);
    const doneTasks = filteredTasks.filter((task) => task.stateId === 300);

    // Atualize o estado das tarefas com os valores filtrados
    setTasks(todoTasks);
    setTasksDoing(doingTasks);
    setTasksDone(doneTasks);
  }, []);


  async function handleTaskDrop(e, newStateId) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    console.log("token:", token);

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
        await fetchTasksByUser(usernameURL);
        console.log("tasks", taskStore.getState().tasks);
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
        throw new Error("Failed to update task state");
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
            <h2 className="main-home">To do</h2>
          </div>
          <div
            className="panel"
            id="todo"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleTaskDrop(e, 100)}
          >
            {tasks.map((task) => (
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
            {tasksDoing.map((task) => (
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
            {tasksDone.map((task) => (
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
