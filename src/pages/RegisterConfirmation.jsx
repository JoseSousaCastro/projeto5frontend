import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../pages/RegisterConfirmation.css";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function RegisterConfirmation() {
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
    }
    try {
      const response = await fetch(
        `http://localhost:8080/project5/rest/users/${username}/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            newpassword: inputs.password,
          },
        }
      );

      if (response.ok) {
        console.log("Password successfully set!");
        toast.success(t("passwordSuccessfullySet")); // Tradução da mensagem de sucesso
        navigate("/", { replace: true });
      } else {
        const responseBody = await response.text();
        console.error("Registration error:", response.statusText, responseBody);
        toast.warn(t("errorSettingPassword")); // Tradução da mensagem de erro
      }
    } catch (error) {
      console.error("Request error:", error);
    }
  };

  return (
    <div className="RegisterConfirm" id="register-confirm-outer-container">
      <div className="page-wrap" id="register-confirm-page-wrap">
        <div className="register-confirm-panel">
          <img
            id="logo-register"
            src="/multimedia/logo-scrum-01.png"
            alt="Agile-Scrum-logo"
            width="250"
          />
          <form
            id="confirm-registrationForm"
            className="inputs-register-confirm"
            onSubmit={handleSubmit}
          >
            <input
              type="password"
              className="inputRegister-password"
              id="password-register-confirm"
              name="password"
              placeholder={t("passwordPlaceholder")} // Tradução do placeholder
              onChange={handleChange}
              required
            />
            <input
              type="password"
              className="inputRegister-password"
              id="passwordConfirm-register-confirm"
              name="passwordConfirm"
              placeholder={t("confirmPasswordPlaceholder")} // Tradução do placeholder
              onChange={handleChange}
              required
            />
            <button type="submit" id="registerButton-register-confirm">
              {t("confirmRegistration")} {/* Tradução do texto do botão */}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterConfirmation;
