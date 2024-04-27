import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EditProfile from "./pages/EditProfile";
import TasksAddTask from "./pages/TasksAddTask";
import TasksDeleted from "./pages/TasksDeleted";
import TasksCategories from "./pages/TasksCategories";
import TasksEditTask from "./pages/TasksEditTask";
import RegisterUserPage from "./pages/RegisterUserPage";
import UsersDeleted from "./pages/UsersDeleted";
import UsersEditUser from "./pages/UsersEditUser";
import UsersList from "./pages/UsersList";
import TasksByUser from "./pages/TasksByUser";
import TasksByCategory from "./pages/TasksByCategory";
import RegisterConfirmation from "./pages/RegisterConfirmation";
import RecoverPass from "./pages/RecoverPass";
import PasswordReset from "./pages/PasswordReset";
import Dashboard from "./pages/Dashboard";
import UsersListAll from "./pages/UsersListAll";
import { ToastContainer } from "react-toastify"; // Importe o ToastContainer aqui
import "react-toastify/dist/ReactToastify.css"; // Importe o estilo CSS do react-toastify

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home/" element={<Home />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/add-task" element={<TasksAddTask />} />
        <Route path="/tasks-deleted" element={<TasksDeleted />} />
        <Route path="/tasks-categories" element={<TasksCategories />} />
        <Route path="/edit-task/:taskId" element={<TasksEditTask />} />
        <Route path="/register-user" element={<RegisterUserPage />} />
        <Route path="/deleted-users" element={<UsersDeleted />} />
        <Route path="/user-profile/:username" element={<UsersEditUser />} />
        <Route path="/users-list" element={<UsersList />} />
        <Route path="/tasksbu/:username" element={<TasksByUser />} />
        <Route path="/tasksbc/:category" element={<TasksByCategory />} />
        <Route
          path="/register-confirmation/:username"
          element={<RegisterConfirmation />}
        />
        <Route path="/recover-password" element={<RecoverPass />} />
        <Route path="/reset-password/:username" element={<PasswordReset />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users-list-all" element={<UsersListAll />} />
      </Routes>
    </>
  );
}

export default App;
