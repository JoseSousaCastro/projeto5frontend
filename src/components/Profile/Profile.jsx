import React, { useState } from "react";
import "../Profile/Profile.css";
import { userStore } from "../../stores/UserStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { statsStore } from "../../stores/StatsStore";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function Profile() {
  const { t } = useTranslation(); // Hook para tradução
  const [inputs] = useState("");
  const navigate = useNavigate();

  const token = userStore((state) => state.token);

  const username = userStore((state) => state.username);
  const email = userStore((state) => state.email);
  const firstName = userStore((state) => state.firstName);
  const lastName = userStore((state) => state.lastName);
  const phone = userStore((state) => state.phone);
  const photoURL = userStore((state) => state.photoURL);
  const updateEmail = userStore((state) => state.updateEmail);
  const updateFirstName = userStore((state) => state.updateFirstName);
  const updateLastName = userStore((state) => state.updateLastName);
  const updatePhone = userStore((state) => state.updatePhone);
  const updatePhotoURL = userStore((state) => state.updatePhotoURL);

  const { fetchUserStats } = statsStore();

  useEffect(() => {
    fetchUserStats(username);
  }, [username]);

  const totalUserTasks = statsStore((state) => state.totalUserTasks);
  const totalUserToDoTasks = statsStore((state) => state.totalUserToDoTasks);
  const totalUserDoingTasks = statsStore((state) => state.totalUserDoingTasks);
  const totalUserDoneTasks = statsStore((state) => state.totalUserDoneTasks);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const user = {
      username: username,
      email: inputs.email,
      firstName: inputs.firstName,
      lastName: inputs.lastName,
      phone: inputs.phone,
      photoURL: inputs.photoURL,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/project5/rest/users/update/${username}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify(user),
        }
      );

      if (response.ok) {
        const user = await response.json();
        await updateEmail(user.email);
        await updateFirstName(user.firstName);
        await updateLastName(user.lastName);
        await updatePhone(user.phone);
        await updatePhotoURL(user.photoURL);
        toast.success(t("profileUpdateSuccess"));

        navigate("/home", { replace: true });
      } else {
        const responseBody = await response.text();
        console.error(
          "Error updating profile:",
          response.statusText,
          responseBody
        );
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    navigate("/home", { replace: true });
  };

  return (
    <div className="global-edit-profile">
      <div className="editProfilePanel">
        <div className="editProfile-title-photo">
          {photoURL && (
            <img src={photoURL} alt="User" className="editProfile-photo" />
          )}
          <label id="username-title-editProfile">{username}</label>
        </div>
        <form
          className="editProfile-register"
          id="edit-profile-form"
          onSubmit={handleSubmit}
        >
          <div className="editProfile-fieldsContainer">
            <div className="left-fields-editProfile">
              <label
                className="labels-edit-profile"
                id="email-editProfile-label"
              >
                {t("emailLabel")}
              </label>
              <input
                type="email"
                className="editProfile-fields"
                id="email-editProfile"
                onChange={(e) => updateEmail(e.target.value)}
                required
                value={email}
              ></input>
              <label
                className="labels-edit-profile"
                id="firstName-editProfile-label"
              >
                {t("firstNameLabel")}
              </label>
              <input
                type="text"
                className="editProfile-fields"
                id="firstName-editProfile"
                name="firstName"
                onChange={(e) => updateFirstName(e.target.value)}
                required
                value={firstName}
              ></input>
              <label
                className="labels-edit-profile"
                id="lastName-editProfile-label"
              >
                {t("lastNameLabel")}
              </label>
              <input
                type="text"
                className="editProfile-fields"
                id="lastName-editProfile"
                name="lastName"
                onChange={(e) => updateLastName(e.target.value)}
                required
                value={lastName}
              ></input>
              <label
                className="labels-edit-profile"
                id="phone-editProfile-label"
              >
                {t("phoneLabel")}
              </label>
              <input
                type="text"
                className="editProfile-fields"
                id="phone-editProfile"
                name="phone"
                onChange={(e) => updatePhone(e.target.value)}
                required
                value={phone}
              ></input>
              <label
                className="labels-edit-profile"
                id="photoURL-editProfile-label"
              >
                {t("photoURLLabel")}
              </label>
              <input
                type="url"
                className="editProfile-fields"
                id="photoURL-editProfile"
                name="photoURL"
                onChange={(e) => updatePhotoURL(e.target.value)}
                required
                value={photoURL}
              ></input>
            </div>
          </div>
          <div className="editProfile-Buttons">
            <button type="submit" id="profile-save-button">
              {t("save")}
            </button>
            <button
              type="reset"
              id="profile-cancel-button"
              onClick={handleCancel}
            >
              {t("cancel")}
            </button>
          </div>
        </form>
      </div>
      <div className="stats-own-profile-div">
        <h1 className="stats-own-profile-title">{t("statsTitle")}</h1>
        <label className="stats-own-profile-labels">
          {t("totalTasksLabel")}
        </label>
        <p className="stats-own-profile-infos">{totalUserTasks}</p>
        <label className="stats-own-profile-labels">
          {t("toDoTasksLabel")}
        </label>
        <p className="stats-own-profile-infos">{totalUserToDoTasks}</p>
        <label className="stats-own-profile-labels">
          {t("doingTasksLabel")}
        </label>
        <p className="stats-own-profile-infos">{totalUserDoingTasks}</p>
        <label className="stats-own-profile-labels">
          {t("doneTasksLabel")}
        </label>
        <p className="stats-own-profile-infos">{totalUserDoneTasks}</p>
      </div>
    </div>
  );
}

export default Profile;
