import React, { useState } from "react";
import { taskStore } from "../../stores/TaskStore";
import { userStore } from "../../stores/UserStore";
import { useNavigate } from "react-router-dom";
import { categoryStore } from "../../stores/CategoryStore";
import { toast } from "react-toastify";
import "../AddTask/AddTask.css";

function AddTask() {
  const navigate = useNavigate();
  const [priority, setPriority] = useState("");
  const { categories } = categoryStore(); // Obtém a lista de categorias
  const { fetchTasks } = taskStore(); // Obtém a lista de tarefas

  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
    startDate: "",
    limitDate: "",
    category: "",
  });

  const token = userStore((state) => state.token);
  const username = userStore((state) => state.username);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTaskDetails({ ...taskDetails, [name]: value });
  };

  const handlePriorityClick = (priorityValue) => {
    console.log("priorityValue", priorityValue);
    setPriority(priorityValue);
  };

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setTaskDetails({ ...taskDetails, [name]: value });

    // Verifica se a data final é posterior à data inicial
    if (
      name === "startDate" &&
      taskDetails.limitDate &&
      value > taskDetails.limitDate
    ) {
      setTaskDetails({ ...taskDetails, limitDate: value });
    } else if (
      name === "limitDate" &&
      taskDetails.startDate &&
      value < taskDetails.startDate
    ) {
      setTaskDetails({ ...taskDetails, startDate: value });
    }
  };

  const handleSaveTask = async () => {
    console.log("priority", priority);
    const category = {
      name: taskDetails.category,
    };
    const newTask = {
      title: taskDetails.title,
      description: taskDetails.description,
      priority: parseInt(priority),
      startDate: taskDetails.startDate,
      limitDate: taskDetails.limitDate,
      category: category,
    };
    console.log("newTask", newTask);

    try {
      const response = await fetch(
        `http://localhost:8080/project5/rest/users/${username}/addTask`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify(newTask),
        }
      );

      if (response.ok) {
        await fetchTasks();
        navigate("/home");
      } else {
        const responseBody = await response.text();
        console.error("Error adding task:", response.statusText, responseBody);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="add-task">
      <div className="addTask-title">
        <div className="labels-addTask-top">
          <label htmlFor="titulo-task">Title</label>
        </div>
        <div className="input-addTask-title">
          <input
            type="text"
            id="titulo-task"
            name="title"
            value={taskDetails.title}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="addTask-description">
        <div className="labels-addTask-top">
          <label htmlFor="descricao-task">Description</label>
        </div>
        <div className="input-addTask-description">
          <textarea
            className="text-task"
            id="descricao-task"
            name="description"
            value={taskDetails.description}
            onChange={handleInputChange}
          ></textarea>
        </div>
      </div>
      <div className="task-buttons">
        <div className="status-and-priority">
          <div className="task-priority">
            <div className="field-titles">
              <h4 className="taskH4" id="priority-h4">
                Priority
              </h4>
            </div>
            <div className="priority-buttons">
              <button
                className={`priority-button low ${
                  priority === "100" ? "selected" : ""
                }`}
                id="low-button"
                onClick={() => handlePriorityClick("100")}
              >
                Low
              </button>
              <button
                className={`priority-button medium ${
                  priority === "200" ? "selected" : ""
                }`}
                id="medium-button"
                onClick={() => handlePriorityClick("200")}
              >
                Medium
              </button>
              <button
                className={`priority-button high ${
                  priority === "300" ? "selected" : ""
                }`}
                id="high-button"
                onClick={() => handlePriorityClick("300")}
              >
                High
              </button>
            </div>
          </div>
          <div className="dates">
            <div className="field-titles">
              <h4 className="taskH4" id="dates-h4">
                Dates
              </h4>
            </div>
            <div className="label-dates">
              <label htmlFor="startDate-editTask" className="label-start-date">
                Start date:
              </label>
            </div>
            <div className="input-dates">
              <input
                type="date"
                id="startDate-editTask"
                name="startDate"
                value={taskDetails.startDate}
                onChange={handleDateChange}
              />
            </div>
            <div className="label-dates">
              <label htmlFor="endDate-editTask">End date:</label>
            </div>
            <div className="input-dates">
              <input
                type="date"
                id="endDate-editTask"
                name="limitDate"
                value={taskDetails.limitDate}
                onChange={handleDateChange}
              />
            </div>
          </div>
          <div className="category">
            <div className="field-titles">
              <h4 className="taskH4">Category</h4>
            </div>
            <div className="div-dropdown">
              <select
                id="task-category-edit"
                name="category"
                value={taskDetails.category}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  Choose an option
                </option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="task-save">
            <button
              className="save-button"
              id="save-button"
              onClick={handleSaveTask}
            >
              Add Task
            </button>
            <button
              className="cancel-button"
              id="cancel-button"
              onClick={() => navigate("/home")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTask;
