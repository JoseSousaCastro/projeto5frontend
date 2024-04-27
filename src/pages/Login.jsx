import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userStore } from "../stores/UserStore.jsx";
import { categoryStore } from "../stores/CategoryStore.jsx";
import { taskStore } from "../stores/TaskStore.jsx";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "../pages/Login.css";
import { useTranslation } from "react-i18next";

function Login() {
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  const updateUserStore = userStore((state) => state);
  const updateCategoryStore = categoryStore((state) => state);
  const updateTaskStore = taskStore((state) => state);
  const fetchUsers = userStore((state) => state.fetchUsers);

  const { t } = useTranslation();

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

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

    if (
      inputs.password === undefined ||
      inputs.password === null ||
      inputs.password === ""
    ) {
      alert(t("passwordRequired")); // Tradução da mensagem de alerta
      return;
    }

    const login = {
      username: inputs.username,
      password: inputs.password,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/project5/rest/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(login),
        }
      );

      if (response.ok) {
        toast.success(t("loginSuccess")); // Tradução da mensagem de sucesso
        const user = await response.json();
        // Restante do código...
      } else {
        const responseBody = await response.json();
        toast.error(t("loginFailed")); // Tradução da mensagem de erro
        console.error("Erro no login:", response.statusText, responseBody);
      }
    } catch (error) {
      toast.error(t("loginFailed")); // Tradução da mensagem de erro
      console.error("Erro no login:", error);
    }
  };

  return (
    <div className="Login" id="login-outer-container">
      <div className="page-wrap" id="login-page-wrap">
        <div className="loginpanel">
          <img
            src="/multimedia/logo-scrum-01.png"
            id="logo-login"
            alt="Agile-Scrum-logo"
            width="250"
          />
          <form id="login-form" className="input-login" onSubmit={handleSubmit}>
            <input
              type="text"
              id="username"
              name="username"
              placeholder={t("usernamePlaceholder")} // Tradução do placeholder
              onChange={handleChange}
              required
            />
            <input
              type="password"
              id="password"
              name="password"
              placeholder={t("passwordPlaceholder")} // Tradução do placeholder
              onChange={handleChange}
              required
            />
            <button id="loginButton">{t("signIn")}</button>
          </form>
          <div className="recover-pass">
            <p>
              {t("forgetPassword")}?{" "}
              <Link to="/recover-password" id="recover-link">
                {t("recoverPassword")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
