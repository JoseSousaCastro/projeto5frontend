import React from "react";
import "../CategoriesMain/CategoriesMain.css";
import { categoryStore } from "../../stores/CategoryStore";
import { useTranslation } from "react-i18next";

function CategoriesMain() {
  const { t } = useTranslation();
  const { categories } = categoryStore();

  return (
    <div className="task-categories">
      <div className="titulo-main-categories">
        <h2 className="main-home-categories">{t("categoriesTitle")}</h2>
      </div>
      <div className="panel-categories" id="categories">
        {categories.map((category) => (
          <div key={category} className="category-item">
            <p>{category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoriesMain;
