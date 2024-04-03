import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../UsersAside/UsersAside.css";
import { userStore } from "../../stores/UserStore";


function UsersAside() {
    const { users, fetchUsers } = userStore();

    const navigate = useNavigate();

    const [selectedUser, setSelectedUser] = useState("");
    const [selectedTypeOfUser, setSelectedTypeOfUser] = useState("");
    const [username, setUsername] = useState(""); // Estado para armazenar o nome de usuário

    const token = userStore((state) => state.token);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const users = await fetchUsers();
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        getUsers();
    }, [fetchUsers]);

    useEffect(() => {
        // Se um usuário estiver selecionado e os usuários estiverem carregados
        if (selectedUser && users.length) {
            // Encontra o usuário selecionado na lista de usuários
            const selectedUserObj = users.find(user => user.id === selectedUser);
            // Se o usuário existir e tiver um tipo, defina o tipo de usuário selecionado como o tipo do usuário
            if (selectedUserObj && selectedUserObj.type) {
                setSelectedTypeOfUser(selectedUserObj.type);
                setUsername(selectedUserObj.username); // Define o nome de usuário
            }
        }
    }, [selectedUser, users]);


    console.log("username", username);

    const handleTypeOfUser = async () => {
        try {
            const response = await fetch(`http://localhost:8080/project5/rest/users/update/${username}/role`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    token: token,
                    role: selectedTypeOfUser // Adicionando o cabeçalho role com o valor selecionado
                },
                body: JSON.stringify({
                    role: selectedTypeOfUser
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
    }

    return (
        <div>
            <div className="aside-usersAside">
                <div className="buttons-top">
                    {/* Botão para adicionar tarefa que leva à página Add user */}
                    <Link to="/register-user">
                        <button className="aside-button">Add User</button>
                    </Link>
                    <Link to="/deleted-users">
                        <button className="aside-button" id="deleted-users-button">Deleted Users</button>
                    </Link>
                </div>
                {/* Dropdown menu para alterar role do user */}
                <label className="dropdown-label">Change user role</label>
                <div className="dropdown">
                    <select className="dropdown-select" onChange={(e) => setSelectedUser(e.target.value)} value={selectedUser}>
                        <option value="">Choose user</option>
                        {users && users.filter(user => user.visible).map(user => (
                            <option key={user.id} value={user.id}>{user.firstName} {user.lastName}</option>
                        ))}
                    </select>
                    <select className="dropdown-select role-select" onChange={(e) => setSelectedTypeOfUser(e.target.value)} value={selectedTypeOfUser}>
                        <option value="">Choose role</option>
                        <option value="100">Developer</option>
                        <option value="200">Scrum Master</option>
                        <option value="300">Product Owner</option>
                    </select>
                    <div>
                        <button className="filter-button" onClick={handleTypeOfUser}>Change role</button>
                    </div>
                    {/* Botão para deletar todas as tarefas do usuário selecionado */}
                </div>
            </div>
        </div>
    );
}

export default UsersAside;
