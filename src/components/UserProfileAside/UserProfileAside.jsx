import React from "react";
import "./UserProfileAside.css";
import { useParams } from "react-router-dom";
import { statsStore } from "../../stores/StatsStore";


function UserProfileAside() {

    const totalUserTasks = statsStore((state) => state.totalUserTasks);
    const totalUserToDoTasks = statsStore((state) => state.totalUserToDoTasks);
    const totalUserDoingTasks = statsStore((state) => state.totalUserDoingTasks);
    const totalUserDoneTasks = statsStore((state) => state.totalUserDoneTasks);

    return (
        <div className="stats-aside-div">
            <h1 className="stats-aside-title">Stats</h1>
            <label className="stats-aside-labels">Total tasks</label>
            <p className="stats-aside-infos">{totalUserTasks}</p>
            <label className="stats-aside-labels">To do tasks</label>
            <p className="stats-aside-infos">{totalUserToDoTasks}</p>
            <label className="stats-aside-labels">Doing tasks</label>
            <p className="stats-aside-infos">{totalUserDoingTasks}</p>
            <label className="stats-aside-labels">Done tasks</label>
            <p className="stats-aside-infos">{totalUserDoneTasks}</p>
        </div>
    );
}

export default UserProfileAside;