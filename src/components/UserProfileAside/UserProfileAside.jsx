import React from "react";
import "./UserProfileAside.css";
import { userStore } from "../../stores/UserStore";
import { useParams } from "react-router-dom";
import { taskStore } from "../../stores/TaskStore";


function UserProfileAside() {
    const { username } = useParams();

    const totalTasks = taskStore(state => state.tasks.filter(task => task.username === username)).length;
    const getUserTasks = taskStore(state => state.tasks.filter(task => task.username === username));
    const getUserToDoTasks = getUserTasks.filter(task => task.stateId === 100).length;
    const getUserDoingTasks = getUserTasks.filter(task => task.stateId === 200).length;
    const getUserDoneTasks = getUserTasks.filter(task => task.stateId === 300).length;

    return (
        <div className="stats-aside-div">
            <h1 className="stats-aside-title">Stats</h1>
            <label className="stats-aside-labels">Total tasks</label>
            <p className="stats-aside-infos">{totalTasks}</p>
            <label className="stats-aside-labels">To do tasks</label>
            <p className="stats-aside-infos">{getUserToDoTasks}</p>
            <label className="stats-aside-labels">Doing tasks</label>
            <p className="stats-aside-infos">{getUserDoingTasks}</p>
            <label className="stats-aside-labels">Done tasks</label>
            <p className="stats-aside-infos">{getUserDoneTasks}</p>
        </div>
    );
}

export default UserProfileAside;