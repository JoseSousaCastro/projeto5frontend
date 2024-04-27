import React from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../pages/RegisterConfirmation.css";
import { toast } from "react-toastify";

function RegisterConfirmation() {
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  const usernameURL = useParams().username;

  console.log("usernameURL", usernameURL);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (inputs.password !== inputs.passwordConfirm) {
      toast.warn("Passwords do not match");
      return;
    }
    console.log("usernameURL", usernameURL);
    console.log("inputs.password", inputs.password);
    try {
      const response = await fetch(
        `http://localhost:8080/project5/rest/users/${usernameURL}/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            newpassword: inputs.password,
          },
        }
      );

      if (response.ok) {
        // Registro bem-sucedido
        console.log("Password definida com sucesso!");
        toast.success("Password successfully set!");
        navigate("/", { replace: true });
      } else {
        const responseBody = await response.text();
        console.error("Erro no registo:", response.statusText, responseBody);
        toast.warn("Error setting password");
        // Pode exibir uma mensagem de erro para o usuário
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
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
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              className="inputRegister-password"
              id="passwordConfirm-register-confirm"
              name="passwordConfirm"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
            />
            <button type="submit" id="registerButton-register-confirm">
              Confirm registration
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterConfirmation;
