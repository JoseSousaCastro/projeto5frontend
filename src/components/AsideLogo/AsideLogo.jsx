import React from "react";
import "../AsideLogo/AsideLogo.css";
import { Link } from "react-router-dom";

function AsideLogo() {
    return (
        <div className="aside-logo">
            <div className="div-back-home">
                <Link to="/home" className="link-to-home">Back to tasks</Link>
            </div>
            <img src="/multimedia/symbol-05.png" id="logo-aside" width="220" alt="Agile-Scrum-logo"/>
        </div>
    );
}

export default AsideLogo;