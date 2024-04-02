import React from "react";
import '../index.css'
import Header from "../components/Header/Header";
import UsersAside from "../components/UsersAside/UsersAside";
import AsideLogoUsers from "../components/AsideLogoUsers/AsideLogoUsers";
import UsersMain from "../components/UsersMain/UsersMain";
import Footer from "../components/Footer/Footer";
import { userStore } from "../stores/UserStore";

function UsersList() {
    const typeOfUser = userStore((state) => state.typeOfUser);

    return (
        <div className="Home" id="home-outer-container">
            <div className="page-wrap" id="home-page-wrap">
                <div className="header-home-container">
                    <Header />
                </div>
                <div className="aside-main-home-container">
                {typeOfUser === 300 && ( // Renderiza UsersAside apenas para typeOfUser igual a 300
                        <div className="aside-home-container">
                            <UsersAside />
                        </div>
                    )}
                    {typeOfUser === 200 && ( // Renderiza AsideLogoUsers apenas para typeOfUser igual a 200
                        <div className="aside-home-container">
                            <AsideLogoUsers />
                        </div>
                    )}
                    <div className="main-home-container">
                        <UsersMain />
                    </div>
                </div>
                <div className="footer-home-container">
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default UsersList