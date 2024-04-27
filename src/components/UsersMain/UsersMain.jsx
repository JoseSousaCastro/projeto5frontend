import React, { useEffect, useState } from "react";
import "../UsersMain/UsersMain.css";
import { userStore } from "../../stores/UserStore";
import UserCard from "../UserCard/UserCard";
import { useTranslation } from "react-i18next";

function UsersMain() {
  const { fetchUsers, users } = userStore();
  const [loaded, setLoaded] = useState(false);
  const { t } = useTranslation(); // Adicionando useTranslation para tradução

  useEffect(() => {
    // Use fetchUsers para buscar os usuários apenas uma vez após a montagem do componente
    if (!loaded) {
      fetchUsers();
      setLoaded(true);
    }
  }, [fetchUsers, loaded]);

  // Verifica se os usuários já foram carregados
  if (!loaded) {
    return <div>{t("loadingText")}</div>; // Traduzindo texto de carregamento
  }

  // Filtra o user que está logado
  const allUsersExceptLoggedUser = users.filter(
    (user) => user.username !== userStore.getState().username
  );

  const deletedUsers = allUsersExceptLoggedUser.filter((user) => user.visible);

  // Filtra os usuários por tipo
  const usersDeveloper = deletedUsers.filter((user) => user.typeOfUser === 100);
  const usersScrumMaster = deletedUsers.filter(
    (user) => user.typeOfUser === 200
  );
  const usersProductOwner = deletedUsers.filter(
    (user) => user.typeOfUser === 300
  );

  return (
    <div className="users-users-list" id="users-users-list-outer-container">
      <div className="page-wrap-user-list" id="users-users-list-page-wrap">
        <div className="user-section">
          <div className="titulo-main">
            <h2 className="main-home">{t("developerTitle")}</h2> {/* Traduzindo título */}
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
            <h2 className="main-home">{t("scrumMasterTitle")}</h2> {/* Traduzindo título */}
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
            <h2 className="main-home">{t("productOwnerTitle")}</h2> {/* Traduzindo título */}
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

export default UsersMain;
