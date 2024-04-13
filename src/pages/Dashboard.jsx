import React from "react";
import '../index.css';
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import DashboardMain from "../components/DashboardMain/DashboardMain";
import DashboardAside from "../components/DashboardAside/DashboardAside";

function Dashboard() {
    return (
        <div className="Dashboard" id="dashboard-outer-container">
            <div className="page-wrap" id="dashboard-page-wrap">
                <div className="header-dashboard-container">
                    <Header />
                </div>
                <div className="aside-main-dashboard-container">
                    <div className="aside-dashboard-container">
                        <DashboardAside />
                    </div>
                    <div className="main-dashboard-container">
                        <DashboardMain />
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}

export default Dashboard