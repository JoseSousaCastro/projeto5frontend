import React from "react";
import "../UserCard/UserCard.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../stores/UserStore";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function UserCard({ user }) {
  const { t } = useTranslation();
  const { fetchUsers } = userStore();
  const navigate = useNavigate();
  const token = userStore((state) => state.token);
  const typeOfUser = userStore((state) => state.typeOfUser);

  const { username, firstName, lastName, visible, confirmed } = user;

  const currentUser = userStore((state) => state.username);

  const handleEraseUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/project5/rest/users/update/${username}/visibility`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

      if (response.ok) {
        await fetchUsers();
        toast.warn(t("userDeleted"));
        navigate("/users-list", { replace: true });
      } else {
        const responseBody = await response.text();
        console.error("Error deleting user:", responseBody);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/project5/rest/users/${username}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

      if (response.ok) {
        await fetchUsers();
        toast.warn(t("userDeletedPermanently"));
        navigate("/deleted-users", { replace: true });
      } else {
        const responseBody = await response.text();
        console.error("Error deleting user:", responseBody);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleRestoreUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/project5/rest/users/update/${username}/visibility`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

      if (response.ok) {
        await fetchUsers();
        toast.info(t("userRestored"));
        navigate("/users-list", { replace: true });
      } else {
        const responseBody = await response.text();
        console.error("Error restoring user:", responseBody);
      }
    } catch (error) {
      console.error("Error restoring user:", error);
    }
  };

  return (
    <div
      className={`user ${!user.confirmed ? "user-not-confirmed" : ""}`}
      style={{ backgroundColor: visible ? "white" : "#EDEDED" }}
    >
      {visible ? (
        // se for o próprio utilizador encaminhar para outro route /edit-profile
        currentUser === username ? (
          <Link to="/edit-profile" className="user-username-solo">
            {firstName} {lastName}
          </Link>
        ) : (
          <Link to={`/user-profile/${username}`} className="user-username-solo">
            {firstName} {lastName}
          </Link>
        )
      ) : (
        <div className="user-username-solo user-username-solo-visible">
          {firstName} {lastName}
        </div>
      )}
      {visible ? (
        <div className="user-visible">
          {typeOfUser === 300 && (
            <img
              src="multimedia/dark-cross-01.png"
              alt="Visible"
              className="visible-icon"
              onClick={handleEraseUser}
            />
          )}
        </div>
      ) : (
        <div className="user-del-restore">
          <div className="user-restore">
            <img
              src="multimedia/reload1-03.png"
              alt="Restore"
              className="restore-icon"
              onClick={handleRestoreUser}
            />
          </div>
          <div className="user-delete">
            <img
              src="multimedia/dark-cross-01.png"
              alt="Delete"
              className="delete-icon"
              onClick={handleDeleteUser}
            />
          </div>
        </div>
      )}
    </div>
  );
}
