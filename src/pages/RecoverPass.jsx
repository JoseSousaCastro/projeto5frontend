import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../pages/RecoverPass.css";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function RecoverPass() {
  const [inputs, setInputs] = useState({});
  const { t } = useTranslation();

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = inputs.email;

    try {
      const response = await fetch(
        "http://localhost:8080/project5/rest/users/recover-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            email: email,
          },
        }
      );

      if (response.ok) {
        toast.warn(t("emailSent")); // Tradução da mensagem de aviso
      } else {
        const responseBody = await response.text();
        console.error(
          "Email not sent, error:",
          toast.error(t("somethingWentWrong")), // Tradução da mensagem de erro
          response.statusText,
          responseBody
        );
      }
    } catch (error) {
      console.error("Request error:", error);
    }
  };

  return (
    <div className="recover-password" id="recover-password-outer-container">
      <div className="page-wrap" id="recover-password-page-wrap">
        <div className="recover-password-panel">
          <img
            src="/multimedia/logo-scrum-01.png"
            id="logo-login"
            alt="Agile-Scrum-logo"
            width="250"
          />
          <form
            id="recover-password-form"
            className="input-email"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              id="email"
              name="email"
              placeholder={t("emailPlaceholder")} // Tradução do placeholder
              onChange={handleChange}
              required
            />
            <button type="submit" id="recoverButton">
              {t("recover")} {/* Tradução do texto do botão */}
            </button>
            <div className="login-link">
              <p>
                {t("rememberedPassword")}{" "}
                <Link to="/" id="login-link">
                  {t("signIn")}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RecoverPass;
