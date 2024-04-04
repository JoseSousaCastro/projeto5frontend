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
        }
    }, [selectedUser, users]);

    const handleUserSelect = (selectField) => {
        const newUsername = selectField[selectField.selectedIndex].value;
    
        setSelectedUser(newUsername);
        const selectedUserObj = users.find(user => user.username === newUsername);

        setUsername(selectedUserObj.username);

        console.log("selected user", selectedUserObj);
        console.log("selected type of user", selectedTypeOfUser);
        console.log("selected username", newUsername);
    };
    

    const handleTypeOfUser = async (typeOfUser) => {
        try {
            const response = await fetch(`http://localhost:8080/project5/rest/users/update/${username}/role`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    token: token,
                    role: typeOfUser
                },
                body: JSON.stringify({
                    role: typeOfUser
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
                        <button className={`role-button developer ${selectedTypeOfUser === 100 ? "selected" : ""}`} >Developer</button>
                        <br />
                        <button className={`role-button scrumMaster ${selectedTypeOfUser === 200 ? "selected" : ""}`} >Scrum Master</button>
                        <br />
                        <button className={`role-button productOwner ${selectedTypeOfUser === 300 ? "selected" : ""}`} >Product Owner</button>
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
