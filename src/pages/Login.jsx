import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userStore } from "../stores/UserStore.jsx";
import { categoryStore } from "../stores/CategoryStore.jsx";
import { taskStore } from "../stores/TaskStore.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../pages/Login.css";
import { useTranslation } from "react-i18next";
import useLanguageStore from "../stores/UseLanguageStore";

function Login() {
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  const updateUserStore = userStore((state) => state);
  const updateCategoryStore = categoryStore((state) => state);
  const updateTaskStore = taskStore((state) => state);
  const fetchUsers = userStore((state) => state.fetchUsers);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const { t } = useTranslation(); // Hook de tradução

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
          console.error(t("errorFetchingTasks"), error); // Tradução do erro
        }
      }
    };

    fetchTasksIfNeeded();
  }, [tasksFetched, updateTaskStore, t]);

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
        updateUserStore.updateConfirmed(user.confirmed);
        updateUserStore.updateExpirationTime(user.expirationTime);

        if (user.confirm === false && user.expirationTime !== 0) {
          toast.warn(t("checkEmailToConfirmAccount")); // Tradução da mensagem de aviso
          return;
        } else if (user.confirm === false && user.expirationTime === 0) {
          toast.error(t("accountBlockedContactAdmin")); // Tradução da mensagem de erro
          return;
        }

        // Fetch das categorias e armazenamento na store de categorias
        try {
          const responseCategories = await fetch(
            "http://localhost:8080/project5/rest/users/categories",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                token: user.token, // Adicione o token de autenticação
              },
            }
          );

          if (responseCategories.ok) {
            const categories = await responseCategories.json();
            console.log("Categorias:", categories);
            updateCategoryStore.setCategories(
              categories.map((category) => category.name)
            );
          } else {
            console.error(
              t("failedFetchCategories"), // Tradução da mensagem de erro
              responseCategories.statusText
            );
          }
        } catch (error) {
          console.error(t("errorFetchingCategories"), error); // Tradução do erro
        }

        // Fetch de todas as tarefas e armazenamento na store de tarefas
        try {
          await updateTaskStore.fetchTasks(); // Chama a função fetchTasks da store de tarefas
        } catch (error) {
          console.error(t("errorFetchingTasks"), error); // Tradução do erro
        }
        console.log("Tasks:", updateTaskStore.tasks);

        console.log("Login feito com sucesso!");

        await fetchUsers();
        navigate("/home", { replace: true });

        console.log("Usuários:", updateUserStore.users);
      } else {
        const responseBody = await response.json();
        toast.error(t("loginFailed")); // Tradução da mensagem de erro
        console.error("Erro no login:", response.statusText, responseBody);
        // Pode exibir uma mensagem de erro para o usuário
      }
    } catch (error) {
      toast.error(t("loginFailed")); // Tradução da mensagem de erro
      console.error("Erro no login:", error);
      // Pode exibir uma mensagem de erro para o usuário
    }
  };

  const handleLanguageClick = (lang) => {
    setSelectedLanguage(lang);
    setLanguage(lang);
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
          <div className="language-selector">
            <button
              className={`language-button ${
                selectedLanguage === "en" ? "selected" : ""
              }`}
              onClick={() => handleLanguageClick("en")}
            >
              EN
            </button>
            <button
              className={`language-button ${
                selectedLanguage === "pt" ? "selected" : ""
              }`}
              onClick={() => handleLanguageClick("pt")}
            >
              PT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
