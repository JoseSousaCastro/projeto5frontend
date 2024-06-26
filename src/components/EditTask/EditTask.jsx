import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { taskStore } from "../../stores/TaskStore";
import { userStore } from "../../stores/UserStore";
import { categoryStore } from "../../stores/CategoryStore";
import "../EditTask/EditTask.css";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function EditTask() {
  const navigate = useNavigate();
  const { categories } = categoryStore();
  const { taskId } = useParams();
  const token = userStore((state) => state.token);
  const task = taskStore((state) =>
    state.tasks.find((task) => task.id === taskId)
  );
  const fetchTasks = taskStore((state) => state.fetchTasks);
  const typeOfUser = userStore((state) => state.typeOfUser);
  const { t } = useTranslation();

  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
    stateId: "",
    priority: "",
    startDate: "",
    limitDate: "",
    category: "",
  });

  const [selectedCategory, setSelectedCategory] = useState(
    taskDetails.category
  );
  const [stateId, setStateId] = useState("");
  const [priority, setPriority] = useState("");

  useEffect(() => {
    if (task) {
      setTaskDetails({
        title: task.title || "",
        description: task.description || "",
        stateId: task.stateId || "",
        priority: task.priority || "",
        startDate: task.startDate || "",
        limitDate: task.limitDate || "",
        category: task.category || {},
      });
      setSelectedCategory(task.category || {});
      setStateId(task.stateId || "");
      setPriority(task.priority || "");
    }
  }, [task]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "category") {
      const newCategory = { name: value };
      setSelectedCategory(newCategory);
      setTaskDetails({ ...taskDetails, category: newCategory });
      console.log("selected category 1", newCategory);
    } else {
      setTaskDetails({ ...taskDetails, [name]: value });
    }
  };

  const handleDateChange = (event) => {
    const { name, value } = event.target;

    if (
      name === "startDate" &&
      taskDetails.limitDate &&
      value > taskDetails.limitDate
    ) {
      setTaskDetails({
        ...taskDetails,
        startDate: value,
        limitDate: value,
      });
    } else {
      setTaskDetails({ ...taskDetails, [name]: value });
    }
  };

  const handlestateClick = (stateId) => {
    setStateId(stateId);
    console.log("stateId", stateId);
    setTaskDetails({ ...taskDetails, stateId: stateId });
  };

  const handlePriorityClick = (priority) => {
    setPriority(priority);
    setTaskDetails({ ...taskDetails, priority: priority });
  };

  const handleSaveTask = async () => {
    console.log("taskDetails", taskDetails);
    try {
      // Verifica se o usuário é proprietário da tarefa
      if (
        typeOfUser === 100 &&
        task.ownerId !== userStore((state) => state.userId)
      ) {
        console.error("Error: Only the task owner can edit this task.");
        return;
      }
      console.log("selected category 2", selectedCategory);
      console.log("taskDetails", taskDetails);
      const response = await fetch(
        `http://localhost:8080/project5/rest/users/updatetask/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({ ...taskDetails }),
        }
      );

      if (response.ok) {
        await fetchTasks();
        toast.success(t("taskUpdatedSuccess"));
        navigate("/home", { replace: true });
      } else {
        const responseBody = await response.text();
        console.error(
          "Error updating task:",
          response.statusText,
          responseBody
        );
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="edit-task">
      <div className="editTask-title">
        <div className="labels-editTask-top">
          <label htmlFor="titulo-task">{t("title")}</label>
        </div>
        <div className="input-editTask-title">
          <input
            type="text"
            id="titulo-task"
            name="title"
            value={taskDetails.title}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="editTask-description">
        <div className="labels-editTask-top">
          <label htmlFor="descricao-task">{t("description")}</label>
        </div>
        <div className="input-editTask-description">
          <textarea
            id="descricao-task"
            name="description"
            value={taskDetails.description}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="task-state">
        <div className="field-titles">
          <h4 className="taskH4" id="state-h4">
            {t("status")}
          </h4>
        </div>
        <div className="state-buttons">
          <button
            className={`state-button todo ${stateId === 100 ? "selected" : ""}`}
            id="todo-button"
            onClick={() => handlestateClick(100)}
          >
            {t("todo")}
          </button>
          <button
            className={`state-button doing ${
              stateId === 200 ? "selected" : ""
            }`}
            id="doing-button"
            onClick={() => handlestateClick(200)}
          >
            {t("doing")}
          </button>
          <button
            className={`state-button done ${stateId === 300 ? "selected" : ""}`}
            id="done-button"
            onClick={() => handlestateClick(300)}
          >
            {t("done")}
          </button>
        </div>
      </div>
      <div className="task-priority">
        <div className="field-titles">
          <h4 className="taskH4" id="priority-h4">
            {t("priority")}
          </h4>
        </div>
        <div className="priority-buttons">
          <button
            className={`priority-button low ${
              priority === 100 ? "selected" : ""
            }`}
            id="low-button"
            onClick={() => handlePriorityClick(100)}
          >
            {t("low")}
          </button>
          <button
            className={`priority-button medium ${
              priority === 200 ? "selected" : ""
            }`}
            id="medium-button"
            onClick={() => handlePriorityClick(200)}
          >
            {t("medium")}
          </button>
          <button
            className={`priority-button high ${
              priority === 300 ? "selected" : ""
            }`}
            id="high-button"
            onClick={() => handlePriorityClick(300)}
          >
            {t("high")}
          </button>
        </div>
      </div>
      <div className="dates">
        <div className="field-titles">
          <h4 className="taskH4" id="dates-h4">
            {t("dates")}
          </h4>
        </div>
        <div className="label-dates-edit">
          <label htmlFor="startDate-editTask" className="label-start-date">
            {t("startDate")}:
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
        <div className="label-dates-edit">
          <label htmlFor="endDate-editTask">{t("endDate")}</label>
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
          <h4 className="taskH4">{t("category")}</h4>
        </div>
        <div className="div-dropdown">
          <select
            id="task-category-edit"
            name="category"
            value={taskDetails.category ? taskDetails.category.name : ""}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              {t("chooseOption")}
            </option>
            {categories.map((category, index) => (
              <option key={index} value={category.name}>
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
          {t("editTask")}
        </button>
        <button
          className="cancel-button"
          id="cancel-button"
          onClick={() => navigate("/home")}
        >
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}

export default EditTask;
