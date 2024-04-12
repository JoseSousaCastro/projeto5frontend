import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userStore } from "../stores/UserStore.jsx";
import { categoryStore } from "../stores/CategoryStore.jsx";
import { taskStore } from "../stores/TaskStore.jsx";
import "../pages/Login.css";

function Login() {
    const [inputs, setInputs] = useState({});
    const navigate = useNavigate();
    const updateUserStore = userStore(state => state);
    const updateCategoryStore = categoryStore(state => state);
    const updateTaskStore = taskStore(state => state);
    const fetchUsers = userStore(state => state.fetchUsers);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
    }

    const [tasksFetched, setTasksFetched] = useState(false);

    useEffect(() => {
        const fetchTasksIfNeeded = async () => {
            if (!tasksFetched) {
                try {
                    await updateTaskStore.fetchTasks();
                    setTasksFetched(true);
                } catch (error) {
                    console.error("Error fetching tasks:", error);
                }
            }
        };

        fetchTasksIfNeeded();
    }, [tasksFetched, updateTaskStore]);

    
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (inputs.password === undefined || inputs.password === null || inputs.password === "") {
            alert("Password is required");
            return;
        }

        const login = {
            username: inputs.username,
            password: inputs.password
        };

        try {
            const response = await fetch("http://localhost:8080/project5/rest/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(login),
            });

            if (response.ok) {
                const user = await response.json();
                updateUserStore.updateUsername(user.username);
                updateUserStore.updateToken(user.token);
                updateUserStore.updatePhotoURL(user.photoURL);
                updateUserStore.updateEmail(user.email);
                updateUserStore.updateFirstName(user.firstName);
                updateUserStore.updateLastName(user.lastName);
                updateUserStore.updatePhone(user.phone);
                updateUserStore.updatePassword(user.password);
                updateUserStore.updateTypeOfUser(user.typeOfUser);
                updateUserStore.updateUserTasks(user.userTasks);
                updateUserStore.updateUserConfirm(user.confirm);
                updateUserStore.updateExpirationTime(user.expirationTime);

                if (user.confirm === false && user.expirationTime !== 0) {
                    alert("Check your email to confirm your account");
                    return;
                } else if (user.confirm === false && user.expirationTime === 0) {
                    alert("Your account is blocked. Please contact the administrator");
                    return;
                }

                // Fetch das categorias e armazenamento na store de categorias
                try {
                    const responseCategories = await fetch("http://localhost:8080/project5/rest/users/categories", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            token: user.token, // Adicione o token de autenticação
                        },
                    });

                    if (responseCategories.ok) {
                        const categories = await responseCategories.json();
                        console.log("Categorias:", categories);
                        updateCategoryStore.setCategories(categories.map(category => category.name));
                    } else {
                        console.error("Failed to fetch categories:", responseCategories.statusText);
                    }
                } catch (error) {
                    console.error("Error fetching categories:", error);
                }

                // Fetch de todas as tarefas e armazenamento na store de tarefas
                try {
                    await updateTaskStore.fetchTasks(); // Chama a função fetchTasks da store de tarefas
                } catch (error) {
                    console.error("Error fetching tasks:", error);
                }
                console.log("Tasks:", updateTaskStore.tasks);

                console.log("Login feito com sucesso!");
                await fetchUsers();
                navigate('/home', { replace: true });
            } else {
                const responseBody = await response.json();
                console.error("Erro no login:", response.statusText, responseBody);
                // Pode exibir uma mensagem de erro para o usuário
            }
        } catch (error) {
            console.error("Erro no login:", error);
            // Pode exibir uma mensagem de erro para o usuário
        }
    }

    return (
        <div className="Login" id="login-outer-container">
            <div className="page-wrap" id="login-page-wrap">
               <div className="loginpanel">
                    <img src="/multimedia/logo-scrum-01.png" id="logo-login" alt="Agile-Scrum-logo" width="250" />
                    <form id="login-form" className="input-login" onSubmit={handleSubmit}>
                        <input type="text" id="username" name="username" placeholder="username" onChange={handleChange} required />
                        <input type="password" id="password" name="password" placeholder="password" onChange={handleChange} required />
                        <button id="loginButton">Sign in</button>
                    </form>
                    <div className="recover-pass">
                        <p>Forget password? <Link to="/recover-password" id="recover-link">Recover password</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
