import React from 'react';
import "../UserCard/UserCard.css";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { userStore } from '../../stores/UserStore';

export default function UserCard({ user }) {
    const { fetchUsers } = userStore();
    const navigate = useNavigate();
    const token = userStore((state) => state.token);
    const typeOfUser = userStore((state) => state.typeOfUser);

    const { username, firstName, lastName, visible } = user;

    const handleEraseUser = async () => {
        try {
            const response = await fetch(`http://localhost:8080/project_backend/rest/users/update/${username}/visibility`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    token: token
                },
            });

            if (response.ok) {
                fetchUsers();
                navigate("/users-list", { replace: true });
            } else {
                const responseBody = await response.text();
                console.error("Erro ao apagar usuário:", responseBody);
            }
        }
        catch (error) {
            console.error("Erro ao apagar usuário:", error);
        }
    }

    const handleDeleteUser = async () => {
        try {
            const response = await fetch(`http://localhost:8080/project_backend/rest/users/${username}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    token: token
                },
            });

            if (response.ok) {
                fetchUsers();
                navigate("/deleted-users", { replace: true });
            } else {
                const responseBody = await response.text();
                console.error("Erro ao apagar usuário:", responseBody);
            }
        }
        catch (error) {
            console.error("Erro ao apagar usuário:", error);
        }
    }

    const handleRestoreUser = async () => {
        try {
            const response = await fetch(`http://localhost:8080/project_backend/rest/users/update/${username}/visibility`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    token: token
                },
            });

            if (response.ok) {
                fetchUsers();
                navigate("/users-list", { replace: true });
            } else {
                const responseBody = await response.text();
                console.error("Erro ao apagar usuário:", responseBody);
            }
        }
        catch (error) {
            console.error("Erro ao apagar usuário:", error);
        }
    }

    return (
        <div className="user" style={{ backgroundColor: visible ? "white" : "#EDEDED" }}>
            {visible ? (
                <Link to={`/edit-user/${username}`} className="user-username-solo">
                    {firstName} {lastName}
                </Link>
            ) : (
                <div className="user-username-solo user-username-solo-visible">
                    {firstName} {lastName}
                </div>
            )}
           
            {visible ? (
                <div className="user-visible">
                     {typeOfUser === 300 && (
                    <img src="multimedia/dark-cross-01.png" alt="Visible" className="visible-icon" onClick={handleEraseUser} />
                    )}
                </div>
            ) : (
                <div className="user-del-restore">
                    <div className="user-restore">
                        <img src="multimedia/reload1-03.png" alt="Restore" className="restore-icon" onClick={handleRestoreUser} />
                    </div>
                    <div className="user-delete">
                        <img src="multimedia/dark-cross-01.png" alt="Delete" className="delete-icon" onClick={handleDeleteUser} />
                    </div>
                </div>
            )}
        </div>
    );
}