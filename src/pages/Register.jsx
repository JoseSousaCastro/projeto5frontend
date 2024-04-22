import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../pages/Register.css";
import { userStore } from "../stores/UserStore.jsx";

function Register() {
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  const updateName = userStore((state) => state.updateName);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const user = {
      username: inputs.username,
      password: inputs.password,
      email: inputs.email,
      firstName: inputs.firstName,
      lastName: inputs.lastName,
      phone: inputs.phone,
      photoURL: inputs.photoURL,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/project5/rest/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );

      if (response.ok) {
        // Registro bem-sucedido
        console.log("Registo feito com sucesso!");
        navigate("/", { replace: true });
        await updateName(inputs.username);
      } else {
        const responseBody = await response.text();
        console.error("Erro no registo:", response.statusText, responseBody);
        // Pode exibir uma mensagem de erro para o usuário
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  return (
    <div className="Register" id="register-outer-container">
      <div className="page-wrap" id="register-page-wrap">
        <div className="center-container-register">
          <div className="registerPanel">
            <img
              id="logo-register"
              src="/multimedia/logo-scrum-01.png"
              alt="Agile-Scrum-logo"
              width="250"
            />
            <form
              id="registrationForm"
              className="inputs-register"
              onSubmit={handleSubmit}
            >
              <div className="right-inputs">
                <input
                  type="text"
                  className="inputRegister-fields"
                  id="username-register"
                  name="username"
                  placeholder="Username"
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  className="inputRegister-fields"
                  id="password-register"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  className="inputRegister-fields"
                  id="passwordConfirm-register"
                  name="passwordConfirm"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  className="inputRegister-fields"
                  id="email-register"
                  name="email"
                  placeholder="Email"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="left-inputs">
                <input
                  type="text"
                  className="inputRegister-fields"
                  id="firstName-register"
                  name="firstName"
                  placeholder="First Name"
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  className="inputRegister-fields"
                  id="lastName-register"
                  name="lastName"
                  placeholder="Last Name"
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  className="inputRegister-fields"
                  id="phone-register"
                  name="phone"
                  placeholder="Phone"
                  onChange={handleChange}
                  required
                />
                <input
                  type="url"
                  className="inputRegister-fields"
                  id="photoURL-register"
                  name="photoURL"
                  placeholder="Photo URL"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="submitButton">
                <button type="submit" id="registerButton-register">
                  Sign up
                </button>
              </div>
            </form>
            <p>
              Already have an account?{" "}
              <Link to="/" id="login-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
