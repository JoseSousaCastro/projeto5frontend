import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../pages/PasswordReset.css";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function PasswordReset() {
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  const { username } = useParams();

  const { t } = useTranslation();

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (inputs.password !== inputs.passwordConfirm) {
      toast.warn(t("passwordsDoNotMatch")); // Tradução da mensagem de aviso
      return;
    } else {
      const password = inputs.password;

      try {
        const response = await fetch(
          `http://localhost:8080/project5/rest/users/${username}/reset-password`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              newpassword: password,
            },
          }
        );

        if (response.ok) {
          toast.success(t("passwordResetSuccess")); // Tradução da mensagem de sucesso
          navigate("/", { replace: true });
        } else {
          const responseBody = await response.text();
          console.error(
            "Error resetting password:",
            response.statusText,
            responseBody
          );
          toast.error(t("passwordResetFailed")); // Tradução da mensagem de erro
        }
      } catch (error) {
        console.error("Request error:", error);
        toast.error(t("passwordResetFailed")); // Tradução da mensagem de erro
      }
    }
  };

  return (
    <div className="password-reset" id="password-reset-outer-container">
      <div className="page-wrap" id="password-reset-page-wrap">
        <div className="password-reset-panel">
          <img
            src="/multimedia/logo-scrum-01.png"
            id="logo-login"
            alt="Agile-Scrum-logo"
            width="250"
          />
          <form
            id="password-reset-form"
            className="input-password"
            onSubmit={handleSubmit}
          >
            <input
              type="password"
              id="password"
              name="password"
              placeholder={t("passwordPlaceholder")} // Tradução do placeholder
              onChange={handleChange}
              required
            />
            <input
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              placeholder={t("confirmPasswordPlaceholder")} // Tradução do placeholder
              onChange={handleChange}
              required
            />
            <button type="submit" id="resetButton">
              {t("resetPassword")} // Tradução do botão
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

export default PasswordReset;
