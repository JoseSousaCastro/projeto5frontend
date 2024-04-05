import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../TasksAside/TasksAside.css";
import { userStore } from "../../stores/UserStore";
import { categoryStore } from "../../stores/CategoryStore";

function TasksAside() {
    const { users, typeOfUser } = userStore(); // Obtém a lista de usuários
    const { categories } = categoryStore(); // Obtém a lista de categorias
    const navigate = useNavigate();

    const [selectedUser, setSelectedUser] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const deleteAllUserTasks = userStore((state) => state.deleteAllUserTasks);
    const filterTasksByUser = userStore((state) => state.filterTasksByUser);
    const filterTasksByCategory = userStore((state) => state.filterTasksByCategory);

    const token = userStore((state) => state.token);

    const handleFilterByUser = async (event) => {
        event.preventDefault();

        const username = selectedUser;
        try {
            const response = await fetch(`http://localhost:8080/project5/rest/users/${username}/tasks` , {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    token: token,
                },
            });
            if (response.ok) {
                const tasks = await response.json();
                await filterTasksByUser(tasks);
                navigate("/home", { replace: true });
            } else {
                const responseBody = await response.text();
                console.error("Error filtering tasks by user:", response.statusText, responseBody);
            }
        } catch (error) {
            console.error("Error filtering tasks by user:", error);
        }
    };


    const handleFilterByCategory  = async (event) => {
        event.preventDefault();

        const category = selectedCategory;
        try {
            const response = await fetch(`http://localhost:8080/project5/rest/users/tasks/${category}` , {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    token: token,
                },
            });
            if (response.ok) {
                const tasks = await response.json();
                await filterTasksByCategory(tasks);
                navigate("/home", { replace: true });
            } else {
                const responseBody = await response.text();
                console.error("Error filtering tasks by category:", response.statusText, responseBody);
            }
        } catch (error) {
            console.error("Error filtering tasks by category:", error);
        }
    }

    const handleDeleteAllUserTasks = async (event) => {
        event.preventDefault();

        const username = selectedUser;
        try {
            const response = await fetch(`http://localhost:8080/project5/rest/users/eraseAllTasks/${username}` , {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    token: token,
                },
            });
            if (response.ok) {
                const tasks = await response.json();
                await deleteAllUserTasks(tasks);
                navigate("/home", { replace: true });
            } else {
                const responseBody = await response.text();
                console.error("Error deleting all user tasks:", response.statusText, responseBody);
            }
        } catch (error) {
            console.error("Error deleting all user tasks:", error);
        }
    }

    return (
        <div>
            <div className="aside-tasksAside">
                <div className="buttons-top">
                {/* Botão para adicionar tarefa que leva à página Add Task */}
                <Link to="/add-task">
                    <button className="aside-button">Add Task</button>
                </Link>
                {typeOfUser === 300 && (
                <Link to="/tasks-categories">
                    <button className="aside-button" id="categories-button">Categories</button>
                </Link>
                )}
                {(typeOfUser === 300 || typeOfUser === 200) && (
                <Link to="/tasks-deleted">
                    <button className="aside-button" id="deleted-tasks-button">Deleted Tasks</button>
                </Link>
                )}
                </div>
                {/* Dropdown menu para filtrar tarefas por usuário */}
                {(typeOfUser === 300 || typeOfUser === 200) && (
                <label className="dropdown-label">Filter by user</label>
                )}
                {(typeOfUser === 300 || typeOfUser === 200) && (
                <div className="dropdown">
                    <select className="dropdown-select" onChange={(e) => setSelectedUser(e.target.value)}>
                        <option value="">Choose user</option>
                        {users && users.map(user => (
                            <option key={user.id} value={user.id}>{user.username}</option>
                        ))}
                    </select>
                    {/* Botão para filtrar tarefas pelo usuário selecionado */}
                    <div>
                        <button className="filter-button" onClick={handleFilterByUser}>Filter</button>
                    </div>
                    {/* Botão para deletar todas as tarefas do usuário selecionado */}
                    {(typeOfUser === 300 && (
                    <div>
                        <button className="delete-all-user-tasks" onClick={handleDeleteAllUserTasks}>Delete All Tasks</button>
                    </div>
                    ))}
                </div>
                )}
                {/* Dropdown menu para filtrar tarefas por categoria */}
                {(typeOfUser === 300 || typeOfUser === 200) && (
                <label className="dropdown-label">Filter by category</label>
                )}
                {(typeOfUser === 300 || typeOfUser === 200) && (
                <div className="dropdown">
                    <select className="dropdown-select" onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option value="">Choose category</option>
                        {categories && categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    {/* Botão para filtrar tarefas pela categoria selecionada */}
                    <div>
                        <button className="filter-button" onClick={handleFilterByCategory}>Filter</button>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
}

export default TasksAside;