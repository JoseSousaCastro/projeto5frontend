import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../pages/RecoverPass.css';


function RecoverPass() {
    const [inputs, setInputs] = useState({});
    const navigate = useNavigate();
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const email = inputs.email;
        console.log("inputs.email", inputs.email);
        try {
            const response = await fetch("http://localhost:8080/project5/rest/users/recover-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "email": email,
                },
            });

            if (response.ok) {
                console.log("Email sent!");
                // alerta para o utilizador a indicar que foi enviado um email para recuperar a password
            } else {
                const responseBody = await response.text();
                console.error("Email not send, error:", response.statusText, responseBody);
            }
        } catch (error) {
            console.error("Request error:", error);
        }
    };


    return (
        <div className="recover-password" id="recover-password-outer-container">
            <div className="page-wrap" id="recover-password-page-wrap">
               <div className="recover-password-panel">
                    <img src="/multimedia/logo-scrum-01.png" id="logo-login" alt="Agile-Scrum-logo" width="250" />
                    <form id="recover-password-form" className="input-email" onSubmit={handleSubmit}>
                        <input type="email" id="email" name="email" placeholder="email" onChange={handleChange} required />
                        <button type="submit" id="recoverButton">Recover</button>
                        <div className="login-link">
                            <p>Remembered your password? <Link to="/" id="login-link">Sign in</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RecoverPass;