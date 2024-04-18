import React from "react";
import { Link, useNavigate } from "react-router-dom";
import '../Header/Header.css';
import { userStore } from "../../stores/UserStore";



function Header() {
    const navigate = useNavigate();
    const updateUserStore = userStore(state => state);

    const firstName = userStore(state => state.firstName);
    const photoURL = userStore(state => state.photoURL);
    const typeOfUser = userStore(state => state.typeOfUser);

    const token = userStore(state => state.token);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try
        {
        const logout = await fetch("http://localhost:8080/project5/rest/users/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token: token,
                },
            });
            if (!logout.ok) {
                console.error("Error: Logout failed.");
            } else {
                console.log("Logout successful.");
                updateUserStore.updateToken(""); // Limpar o token
                updateUserStore.updatePassword(""); // Limpar a senha, se estiver armazenada
                // Limpar dados armazenados na sessionStorage
                sessionStorage.removeItem("categoryStore");
                sessionStorage.removeItem("taskStore");
                sessionStorage.removeItem("userStore");
                navigate('/', { replace: true });
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const handleClick = (event) => {
        event.preventDefault();
        navigate('/edit-profile');
    }

    return (
        <div className="header" id="header-outer-container">
            <div className="page-wrap" id="header-page-wrap">
                <div className="logo-home-container">
                    <img src="/multimedia/logo-scrum-05.png" id="logo-header" height="50" alt="Agile-Scrum-logo"/>
                </div>
                <div className="nav-left-container">
                    <nav className="nav-menu-left">
                        <ul id="menu">
                            <li id="nav-tasks"><Link to="/home">Tasks</Link></li>
                            <li id="nav-users"><Link to="/users-list">Users</Link></li>
                            {typeOfUser === 300 ? (
                                <li id="nav-dashboard"><Link to="/dashboard">Dashboard</Link></li>
                            ) : null}
                        </ul>
                    </nav>
                </div>
                <div className="nav-notifications">
                        <label id="notifications-label">5 Notifications</label>
                </div>
                <div className="nav-menu-right">
                    <div className="link-edit-profile">
                        <img src={photoURL} id="profile-pic" alt="profile-pic" />
                        <p id="first-name-label" onClick={handleClick}>{firstName}</p>
                    </div>
                    <button className="logout-button" id="logout-button-header" onClick={handleSubmit}>
                        <img src="/multimedia/logout.png" alt="logout-icon" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Header;