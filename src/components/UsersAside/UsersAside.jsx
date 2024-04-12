import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../UsersAside/UsersAside.css";
import { userStore } from "../../stores/UserStore";

function UsersAside() {
    const { users, fetchUsers } = userStore();
    const navigate = useNavigate();

    const [selectedUser, setSelectedUser] = useState("");
    const [selectedUser2, setSelectedUser2] = useState("");
    const [selectedUser3, setSelectedUser3] = useState("");
    const [selectedTypeOfUser, setSelectedTypeOfUser] = useState("");
    const [username, setUsername] = useState("");
    const [username2, setUsername2] = useState("");
    const [username3, setUsername3] = useState("");
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

    const handleUserSelect2 = (selectField) => {
        const newUsername2 = selectField[selectField.selectedIndex].value;
        setSelectedUser2(newUsername2);
        const selectedUserObj2 = users.find(user => user.username === newUsername2);
        if (selectedUserObj2) {
            setUsername2(selectedUserObj2.username);
            console.log("Selected user:", selectedUserObj2);
        } else {
            setUsername2("");
        }
    };

    const handleUserSelect3 = (selectField) => {
        const newEmail = selectField[selectField.selectedIndex].value;
        setSelectedUser3(newEmail);
        const selectedUserObj3 = users.find(user => user.email === newEmail);
        if (selectedUserObj3) {
            setUsername3(selectedUserObj3.username);
            console.log("Selected user:", selectedUserObj3);
        } else {
            setUsername3("");
        }
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

    const handleGoToProfile = () => {
        if (selectedUser2) {
            navigate(`/user-profile/${selectedUser2}`, { replace: true });
        } else if (selectedUser3) {
            navigate(`/user-profile/${selectedUser3}`, { replace: true });
        }
    }

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
                <label className="dropdown-label">Filter by username or email</label>
                <div className="dropdown">
                    <select className="dropdown-goto-username" onChange={(e) => handleUserSelect2(e.target)} value={selectedUser2}>
                        <option value="">Choose user</option>
                        {users && users.map(user => (
                            <option key={user.username} value={user.username}>{user.firstName} {user.lastName}</option>
                        ))}
                    </select>
                    <select className="dropdown-goto-email" onChange={(e) => handleUserSelect3(e.target)} value={selectedUser3}>
                        <option value="">Choose email</option>
                        {users && users.map(user => (
                            <option key={user.username} value={user.username}>{user.email}</option>
                        ))}
                    </select>
                    <div>
                        <button className="filter-button" onClick={handleGoToProfile}>Go to profile</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UsersAside;
