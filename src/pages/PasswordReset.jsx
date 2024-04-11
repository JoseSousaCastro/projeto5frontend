import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../pages/PasswordReset.css";
import { useParams } from "react-router-dom";



function PasswordReset() {
    const [inputs, setInputs] = useState({});
    const navigate = useNavigate();
    const usernameURL = useParams().username;

    console.log("usernameURL", usernameURL);
    console.log("inputs.password", inputs.password);
    console.log("inputs.passwordConfirm", inputs.passwordConfirm);


    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (inputs.password !== inputs.passwordConfirm) {
            alert("Passwords do not match");
            return;
        } else {
            const password = inputs.password;
            
            try {
                const response = await fetch(`http://localhost:8080/project5/rest/users/${usernameURL}/reset-password`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "newpassword": password
                    },
                });

                if (response.ok) {
                    console.log("Password reset successfully!");
                    console.log("Passord", password);
                    navigate('/', { replace: true });

                } else {
                    const responseBody = await response.text();
                    console.error("Error resetting password:", response.statusText, responseBody);
                }
            } catch (error) {
                console.error("Request error:", error);
            }
        }
    }


    return (
        <div className="password-reset" id="password-reset-outer-container">
            <div className="page-wrap" id="password-reset-page-wrap">
                <div className="password-reset-panel">
                    <img src="/multimedia/logo-scrum-01.png" id="logo-login" alt="Agile-Scrum-logo" width="250" />
                    <form id="password-reset-form" className="input-password" onSubmit={handleSubmit}>
                        <input type="password" id="password" name="password" placeholder="password" onChange={handleChange}required />
                        <input type="password" id="passwordConfirm" name="passwordConfirm" placeholder="confirm password" onChange={handleChange} required />
                        <button type="submit" id="resetButton">Reset password</button>
                        <div className="login-link">
                            <p>Remembered your password? <Link to="/" id="login-link">Sign in</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PasswordReset;