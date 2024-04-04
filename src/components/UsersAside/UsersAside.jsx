import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../UsersAside/UsersAside.css";
import { userStore } from "../../stores/UserStore";

function UsersAside() {
    const { users, fetchUsers } = userStore();
    const navigate = useNavigate();

    const [selectedUser, setSelectedUser] = useState("");
    const [selectedTypeOfUser, setSelectedTypeOfUser] = useState("");
    const [username, setUsername] = useState(""); 
    const [updatedTypeOfUser, setUpdatedTypeOfUser] = useState(""); // Tipo de usuário atualizado localmente

    const token = userStore((state) => state.token);

    useEffect(() => {
        const getUsers = async () => {
            try {
                await fetchUsers();
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        getUsers();
    }, [fetchUsers]);
    
    useEffect(() => {
        const selectedUserObj = users.find(user => user.username === selectedUser);
        if (selectedUserObj && selectedUserObj.typeOfUser) {
            setSelectedTypeOfUser(selectedUserObj.typeOfUser);
            setUsername(selectedUserObj.username);
        } else {
            setSelectedTypeOfUser("");
            setUsername("");
        }
    }, [selectedUser, users]);

    const handleUserSelect = (selectField) => {
        const newUsername = selectField[selectField.selectedIndex].value;
        setSelectedUser(newUsername);
        const selectedUserObj = users.find(user => user.username === newUsername);
        setUsername(selectedUserObj.username);
        setUpdatedTypeOfUser(selectedUserObj.typeOfUser); // Atualizar o tipo de usuário localmente
        console.log("Selected user:", selectedUserObj);
    };
    
    // Função para atualizar o tipo de usuário quando um botão de função de usuário é clicado
    const handleRoleButtonClick = (typeOfUser) => {
        setUpdatedTypeOfUser(typeOfUser);
        console.log("Updated type of user:", typeOfUser);
    };

    // Função para enviar a atualização do tipo de usuário para o backend
    const handleTypeOfUser = async () => {
        try {
            console.log("username:", username);
            console.log("Updating user role:", updatedTypeOfUser);
            console.log("Token:", token);
            const response = await fetch(`http://localhost:8080/project5/rest/users/update/${username}/role`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    token: token,
                    typeOfUser: updatedTypeOfUser // Enviar o tipo de usuário atualizado como cabeçalho
                },
                body: JSON.stringify({
                    typeOfUser: updatedTypeOfUser
                }),
            });
            if (response.ok) {
                await fetchUsers();
                navigate("/users-list", { replace: true });
            } else {
                const responseBody = await response.text();
                console.error("Error changing user role:", response.statusText, responseBody);
            }
        } catch (error) {
            console.error("Error changing user role:", error);
        }
    };

    return (
        <div>
            <div className="aside-usersAside">
                <div className="buttons-top">
                    <Link to="/register-user">
                        <button className="aside-button">Add User</button>
                    </Link>
                    <Link to="/deleted-users">
                        <button className="aside-button" id="deleted-users-button">Deleted Users</button>
                    </Link>
                </div>
                <label className="dropdown-label">Change user role</label>
                <div className="dropdown">
                    <select className="dropdown-select" onChange={(e) => handleUserSelect(e.target)} value={selectedUser}>
                        <option value="">Choose user</option>
                        {users && users.map(user => (
                            <option key={user.username} value={user.username}>{user.firstName} {user.lastName}</option>
                        ))}
                    </select>
                    <div>
                        <button className={`role-button developer ${updatedTypeOfUser === 100 ? "selected" : ""}`} onClick={() => handleRoleButtonClick(100)}>Developer</button>
                        <br />
                        <button className={`role-button scrumMaster ${updatedTypeOfUser === 200 ? "selected" : ""}`} onClick={() => handleRoleButtonClick(200)}>Scrum Master</button>
                        <br />
                        <button className={`role-button productOwner ${updatedTypeOfUser === 300 ? "selected" : ""}`} onClick={() => handleRoleButtonClick(300)}>Product Owner</button>
                        <br />
                    </div>
                    <div>
                        <button className="filter-button" onClick={handleTypeOfUser}>Change role</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UsersAside;
