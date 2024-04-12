import React, { useState, useEffect } from "react";
import "./UserProfile.css";
import { userStore } from "../../stores/UserStore";
import { useNavigate, useParams } from "react-router-dom";

function UserProfile() {
    const [inputs, setInputs] = useState({});
    const navigate = useNavigate();
    const { username } = useParams();
    const typeOfUser = userStore((state) => state.typeOfUser);
    const fetchUsers = userStore((state) => state.fetchUsers);

    const token = userStore((state) => state.token);

    console.log("username", username);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/project5/rest/users/${username}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        token: token,
                    },
                });

                if (response.ok) {
                    const userData = await response.json();
                    console.log("userData", userData);
                    setInputs(userData);
                } else {
                    console.error("Error fetching user data:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [username, token]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(
                `http://localhost:8080/project5/rest/users/update/${username}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        token: token,
                    },
                    body: JSON.stringify(inputs),
                }
            );

            if (response.ok) {
                await fetchUsers();
                navigate("/users-list", { replace: true });
            } else {
                const responseBody = await response.text();
                console.error("Error updating profile:", response.statusText, responseBody);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const handleCancel = (event) => {
        event.preventDefault();
        navigate("/users-list", { replace: true });
    };

    return (
        <div>
            <div className="editProfilePanel">
                <div className="editProfile-title-photo">
                    {inputs.photoURL && (<img src={inputs.photoURL} alt="User" className="editProfile-photo" />)}
                    <label id="username-title-editProfile">{username}</label>
                </div>
                <form className="editProfile-register" id="edit-profile-form" onSubmit={handleSubmit}>
                    <div className="editProfile-fieldsContainer">
                        <div className="left-fields-editProfile">
                            <label className="labels-edit-profile" id="email-editProfile-label">Email</label>
                            <input type="email" className="editProfile-fields" id="email-editProfile" onChange={(e) => setInputs({...inputs, email: e.target.value})} required value={inputs.email || ""} disabled={typeOfUser !== 300}></input>
                            <label className="labels-edit-profile" id="firstName-editProfile-label">First Name</label>
                            <input type="text" className="editProfile-fields" id="firstName-editProfile" name="firstName" onChange={(e) => setInputs({...inputs, firstName: e.target.value})} required value={inputs.firstName || ""} disabled={typeOfUser !== 300}></input>
                            <label className="labels-edit-profile" id="lastName-editProfile-label">Last Name</label>
                            <input type="text" className="editProfile-fields" id="lastName-editProfile" name="lastName" onChange={(e) => setInputs({...inputs, lastName: e.target.value})} required value={inputs.lastName || ""} disabled={typeOfUser !== 300}></input>
                            <label className="labels-edit-profile" id="phone-editProfile-label">Phone</label>
                            <input type="text" className="editProfile-fields" id="phone-editProfile" name="phone" onChange={(e) => setInputs({...inputs, phone: e.target.value})} required value={inputs.phone || ""} disabled={typeOfUser !== 300}></input>
                            <label className="labels-edit-profile" id="photoURL-editProfile-label">Photo URL</label>
                            <input type="url" className="editProfile-fields" id="photoURL-editProfile" name="photoURL" onChange={(e) => setInputs({...inputs, photoURL: e.target.value})} required value={inputs.photoURL || ""} disabled={typeOfUser !== 300}></input>
                        </div>
                    </div>
                    {typeOfUser === 300 && (
                    <div className="editProfile-Buttons">
                        <button type="submit" id="profile-save-button">Save</button>
                        <button type="reset" id="profile-cancel-button" onClick={handleCancel}>Cancel</button>
                    </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default UserProfile;
