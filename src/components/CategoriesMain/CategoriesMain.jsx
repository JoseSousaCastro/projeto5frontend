// list all categories

import React from "react";
import '../CategoriesMain/CategoriesMain.css'
import { categoryStore } from '../../stores/CategoryStore';


function CategoriesMain() {
    const { categories } = categoryStore();

    return (
        <div className="task-categories">
            <div className="titulo-main-categories">
                <h2 className="main-home-categories">Categories</h2>
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