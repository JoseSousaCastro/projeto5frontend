import React, { useEffect, useState } from "react";
import "../DeletedUsers/DeletedUsers.css";
import { userStore } from "../../stores/UserStore";
import UserCard from "../UserCard/UserCard";
import { useTranslation } from "react-i18next";

function DeletedUsers() {
  const { fetchUsers, users } = userStore();
  const [loaded, setLoaded] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Use fetchUsers para buscar os usuários apenas uma vez após a montagem do componente
    if (!loaded) {
      fetchUsers();
      setLoaded(true);
    }
  }, [fetchUsers, loaded]);

  // Verifica se os usuários já foram carregados
  if (!loaded) {
    return <div>{t("loading")}</div>;
  }

  // Filtrar usuários invisíveis
  const deletedUsers = users.filter((user) => !user.visible);

  const usersDeveloper = deletedUsers.filter((user) => user.typeOfUser === 100);
  const usersScrumMaster = deletedUsers.filter(
    (user) => user.typeOfUser === 200
  );
  const usersProductOwner = deletedUsers.filter(
    (user) => user.typeOfUser === 300
  );

  return (
    <div className="users-list" id="users-list-outer-container">
      <div className="page-wrap-user-list" id="users-list-page-wrap">
        <div className="user-section">
          <div className="titulo-main">
            <h2 className="main-home">{t("developer")}</h2>
          </div>
          <div className="panel" id="developer">
            {usersDeveloper.map((user) => (
              <div className="user-card-userMain" key={user.id}>
                <UserCard user={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="user-section">
          <div className="titulo-main">
            <h2 className="main-home">{t("scrumMaster")}</h2>
          </div>
          <div className="panel" id="scrum-master">
            {usersScrumMaster.map((user) => (
              <div className="user-card-userMain" key={user.id}>
                <UserCard user={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="user-section">
          <div className="titulo-main">
            <h2 className="main-home">{t("productOwner")}</h2>
          </div>
          <div className="panel" id="product-owner">
            {usersProductOwner.map((user) => (
              <div className="user-card-userMain" key={user.id}>
                <UserCard user={user} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeletedUsers;
