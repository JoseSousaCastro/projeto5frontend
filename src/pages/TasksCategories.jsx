import React from "react";
import '../index.css'
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import CategoriesAside from "../components/CategoriesAside/CategoriesAside";
import CategoriesMain from "../components/CategoriesMain/CategoriesMain";

function TasksCategories() {

    return (
        <div className="Home" id="home-outer-container">
            <div className="page-wrap" id="home-page-wrap">
                <div className="header-home-container">
                    <Header />
                </div>
                <div className="aside-main-home-container">
                    <div className="aside-home-container">
                        <CategoriesAside />
                    </div>
                    <div className="main-home-container">
                        <CategoriesMain />
                    </div>
                </div>
                <div className="footer-home-container">
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default TasksCategories