import React from "react";
import "../CategoriesAside/CategoriesAside.css";
import { categoryStore } from "../../stores/CategoryStore";
import { userStore } from "../../stores/UserStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function CategoriesAside() {
  const { t } = useTranslation();
  const { categories, fetchCategories } = categoryStore();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editCategoryName, setEditCategoryName] = useState("");
  const [selectedEditCategory, setSelectedEditCategory] = useState("");
  const [selectedDeleteCategory, setSelectedDeleteCategory] = useState("");
  const navigate = useNavigate();

  const token = userStore((state) => state.token);

  const handleAddCategory = async () => {
    if (categories.find((category) => category.name === newCategoryName)) {
      toast.error(t("categoryExists"));
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:8080/project5/rest/users/newCategory/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({ name: newCategoryName }),
        }
      );
      if (response.ok) {
        await fetchCategories();
        setNewCategoryName("");
        setSelectedEditCategory("");
        setEditCategoryName("");
        setSelectedDeleteCategory("");
        toast.info(t("categoryCreated"));
        navigate("/tasks-categories", { replace: true });
      } else {
        const responseBody = await response.text();
        console.error("Error adding category:", response.statusText, responseBody);
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleEditCategory = async () => {
    if (!selectedEditCategory) {
      toast.error(t("selectCategoryEdit"));
      return;
    }

    if (!editCategoryName.trim()) {
      toast.error(t("provideNewName"));
      return;
    }

    if (editCategoryName.trim() === selectedEditCategory) {
      toast.error(t("sameCategoryName"));
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/project5/rest/users/editCategory/${selectedEditCategory}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: token,
            newCategoryName: editCategoryName,
          },
          body: JSON.stringify({}),
        }
      );
      if (response.ok) {
        fetchCategories();
        setNewCategoryName("");
        setSelectedEditCategory("");
        setEditCategoryName("");
        setSelectedDeleteCategory("");
        toast.info(t("categoryChanged"));
        navigate("/tasks-categories", { replace: true });
      } else {
        const responseBody = await response.text();
        console.error("Error editing category:", response.statusText, responseBody);
      }
    } catch (error) {
      console.error("Error editing category:", error);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedDeleteCategory) {
      toast.error(t("selectCategoryDelete"));
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8080/project5/rest/users/deleteCategory/${selectedDeleteCategory}`,
        {
          method: "DELETE",
          headers: {
            token: token,
          },
        }
      );
      if (response.ok) {
        fetchCategories();
        setNewCategoryName("");
        setSelectedEditCategory("");
        setEditCategoryName("");
        setSelectedDeleteCategory("");
        toast.info(t("categoryDeleted"));
        navigate("/tasks-categories", { replace: true });
      } else {
        const responseBody = await response.text();
        console.error("Error deleting category:", response.statusText, responseBody);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="categories-aside">
      <div className="aside">
        <div className="div-back-home">
          <Link to="/home" className="link-to-home">
            {t("backToTasks")}
          </Link>
        </div>
        <div className="add-category">
          <label className="add-category-label" htmlFor="add-category-button">
            {t("addCategory")}
          </label>
          <div className="add-category-input-container">
            <input
              className="aside-input"
              type="text"
              placeholder={t("newCategory")}
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
          </div>
          <button
            className="aside-button"
            id="add-category-button"
            onClick={handleAddCategory}
          >
            {t("add")}
          </button>
        </div>
        <hr />
        <div className="dropdown-edit-category">
          <label
            className="edit-category-label"
            htmlFor="edit-category-dropdown"
          >
            {t("editCategory")}
          </label>
          <select
            className="dropdown-select"
            id="edit-category-dropdown"
            value={selectedEditCategory}
            onChange={(e) => setSelectedEditCategory(e.target.value)}
          >
            <option value="" disabled selected>
              {t("chooseOption")}
            </option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <div className="edit-category-input-container">
            <input
              className="aside-input"
              id="edit-category-name-input"
              type="text"
              placeholder={t("newName")}
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
            />
          </div>
          <button className="action-button" onClick={handleEditCategory}>
            {t("save")}
          </button>
        </div>
        <hr />
        <div className="dropdown-delete-category">
          <label
            className="delete-category-label"
            htmlFor="delete-category-dropdown"
          >
            {t("deleteCategory")}
          </label>
          <select
            className="dropdown-select"
            id="delete-category-dropdown"
            value={selectedDeleteCategory}
            onChange={(e) => setSelectedDeleteCategory(e.target.value)}
          >
            <option value="" disabled selected>
              {t("chooseOption")}
            </option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <div className="delete-category-button-container">
            <button className="action-button" onClick={handleDeleteCategory}>
              {t("delete")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoriesAside;
