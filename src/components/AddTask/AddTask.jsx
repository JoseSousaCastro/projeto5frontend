import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categoryStore } from "../../stores/CategoryStore";
import { taskStore } from "../../stores/TaskStore";
import { userStore } from "../../stores/UserStore";
import { toast } from "react-toastify";
import "../AddTask/AddTask.css";
import { useTranslation } from "react-i18next";

function AddTask() {
  const navigate = useNavigate();
  const [priority, setPriority] = useState("");
  const { categories } = categoryStore();
  const { fetchTasks } = taskStore();
  const { t } = useTranslation();

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
    setPriority(priorityValue);
  };

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setTaskDetails({ ...taskDetails, [name]: value });

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
        toast.error(t("errorAddingTask"));
      }
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error(t("errorAddingTask"));
    }
  };

  return (
    <div className="add-task">
      <div className="addTask-title">
        <div className="labels-addTask-top">
          <label htmlFor="titulo-task">{t("titleLabel")}</label>
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
          <label htmlFor="descricao-task">{t("descriptionLabel")}</label>
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
              <h4 className="taskH4" id="priority-h4">{t("priorityTitle")}</h4>
            </div>
            <div className="priority-buttons">
              <button
                className={`priority-button low ${
                  priority === "100" ? "selected" : ""
                }`}
                id="low-button"
                onClick={() => handlePriorityClick("100")}
              >
                {t("lowPriority")}
              </button>
              <button
                className={`priority-button medium ${
                  priority === "200" ? "selected" : ""
                }`}
                id="medium-button"
                onClick={() => handlePriorityClick("200")}
              >
                {t("mediumPriority")}
              </button>
              <button
                className={`priority-button high ${
                  priority === "300" ? "selected" : ""
                }`}
                id="high-button"
                onClick={() => handlePriorityClick("300")}
              >
                {t("highPriority")}
              </button>
            </div>
          </div>
          <div className="dates">
            <div className="field-titles">
              <h4 className="taskH4" id="dates-h4">{t("datesTitle")}</h4>
            </div>
            <div className="label-dates">
              <label htmlFor="startDate-editTask" className="label-start-date">
                {t("startDateLabel")}:
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
              <label htmlFor="endDate-editTask">{t("endDateLabel")}</label>
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
              <h4 className="taskH4">{t("categoryTitle")}</h4>
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
                  {t("chooseOption")}
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
              {t("addTaskButton")}
            </button>
            <button
              className="cancel-button"
              id="cancel-button"
              onClick={() => navigate("/home")}
            >
              {t("cancelButton")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTask;
