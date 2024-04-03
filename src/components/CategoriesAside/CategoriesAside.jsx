import React from "react";
import "../CategoriesAside/CategoriesAside.css";
import { categoryStore } from "../../stores/CategoryStore";
import { userStore } from "../../stores/UserStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


function CategoriesAside() {
    const { categories, fetchCategories } = categoryStore();
    const [newCategoryName, setNewCategoryName] = useState(""); // Estado para o novo nome da categoria
    const [editCategoryName, setEditCategoryName] = useState(""); // Estado para o novo nome da categoria
    const [selectedEditCategory, setSelectedEditCategory] = useState(""); // Estado para a categoria selecionada no select de edição
    const [selectedDeleteCategory, setSelectedDeleteCategory] = useState(""); // Estado para a categoria selecionada no select de exclusão
    const navigate = useNavigate();

    const token = userStore((state) => state.token);
    console.log("Token:", token);

    // Função para lidar com a adição de uma nova categoria
    const handleAddCategory = async () => {
        // Verifica se já existe uma categoria com o mesmo nome
        if (categories.find(category => category.name === newCategoryName)) {
            console.error("Category with this name already exists");
            return;
        }
        try {
            console.log({ name: newCategoryName });
            const response = await fetch('http://localhost:8080/project5/rest/users/newCategory/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token,
                },
                body: JSON.stringify({ name: newCategoryName }),
            });
            if (response.ok) {
                fetchCategories();
                setNewCategoryName("");
                setSelectedEditCategory("");
                setEditCategoryName("");
                setSelectedDeleteCategory("");
                navigate("/tasks-categories", { replace: true });
            } else {
                const responseBody = await response.text();
                console.error('Error adding category:', response.statusText, responseBody);
            }
        } catch (error) {
            console.error("Error adding category:", error);
        }
    };

    // Função para lidar com a edição de uma categoria
    const handleEditCategory = async () => {
        // Verificar se uma categoria foi selecionada
        if (!selectedEditCategory) {
            console.error("Please select a category to edit");
            return;
        }
    
        // Verificar se o novo nome da categoria foi fornecido
        if (!editCategoryName.trim()) {
            console.error("Please provide a new name for the category");
            return;
        }
    
        // Verificar se o novo nome é diferente do nome atual da categoria
        if (editCategoryName.trim() === selectedEditCategory) {
            console.error("New category name cannot be the same as the current name");
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:8080/project5/rest/users/editCategory/${selectedEditCategory}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    token: token,
                    newCategoryName: editCategoryName, // Enviar newCategoryName como um cabeçalho de requisição
                },
                body: JSON.stringify({}), // O corpo da requisição pode ser vazio neste caso
            });
            if (response.ok) {
                fetchCategories();
                setNewCategoryName("");
                setSelectedEditCategory("");
                setEditCategoryName("");
                setSelectedDeleteCategory("");
                navigate("/tasks-categories", { replace: true });
            } else {
                const responseBody = await response.text();
                console.error('Error editing category:', response.statusText, responseBody);
            }
        } catch (error) {
            console.error("Error editing category:", error);
        }
    };
    
    

    // Função para lidar com a exclusão de uma categoria
    const handleDeleteCategory = async () => {
        if (!selectedDeleteCategory) {
            console.error("Selected category not found");
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/project5/rest/users/deleteCategory/${selectedDeleteCategory}`, {
                method: 'DELETE',
                headers: {
                    token: token,
                },
            });
            if (response.ok) {
                fetchCategories();
                setNewCategoryName("");
                setSelectedEditCategory("");
                setEditCategoryName("");
                setSelectedDeleteCategory("");
                navigate("/tasks-categories", { replace: true });
            } else {
                const responseBody = await response.text();
                console.error('Error deleting category:', response.statusText, responseBody);
            }
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    return (
        <div className="categories-aside">
            <div className="aside">
                <div className="div-back-home">
                    <Link to="/home" className="link-to-home">Back to tasks</Link>
                </div>
                <div className="add-category">
                    <label className="add-category-label" htmlFor="add-category-button">Add Category</label>
                    <div className="add-category-input-container">
                        <input
                            className="aside-input"
                            type="text"
                            placeholder="New category"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                    </div>
                    <button className="aside-button" id="add-category-button" onClick={handleAddCategory}>Add</button>
                </div>
                <hr />
                <div className="dropdown-edit-category">
                    <label className="edit-category-label" htmlFor="edit-category-dropdown">Edit Category</label>
                    <select className="dropdown-select" id="edit-category-dropdown" value={selectedEditCategory} onChange={(e) => setSelectedEditCategory(e.target.value)}>
                        <option value="" disabled selected>Choose an option</option>
                        {/* Mapeando as categorias para criar as opções do dropdown */}
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    <div className="edit-category-input-container">
                        <input className="aside-input" id="edit-category-name-input" type="text" placeholder="New name" value={editCategoryName} onChange={(e) => setEditCategoryName(e.target.value)} />
                    </div>
                    <button className="action-button" onClick={handleEditCategory}>Save</button>
                </div>
                <hr />
                <div className="dropdown-delete-category">
                    <label className="delete-category-label" htmlFor="delete-category-dropdown">Delete Category</label>
                    <select className="dropdown-select" id="delete-category-dropdown" value={selectedDeleteCategory} onChange={(e) => setSelectedDeleteCategory(e.target.value)}>
                        <option value="" disabled selected>Choose an option</option>
                        {/* Mapeando as categorias para criar as opções do dropdown */}
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    <div className="delete-category-button-container">
                        <button className="action-button" onClick={handleDeleteCategory}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoriesAside;