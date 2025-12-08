import Home from "@/pages/Publicwebsite/Home.tsx";
import Register from "../components/Auth/Register.tsx";
import Login from "../components/Auth/Login.tsx";
import Profile from "../components/Auth/Profile.tsx";
import ProfileEdit from "../components/Auth/ProfileEdit.tsx";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard.tsx";

const routes = [
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/profile",
        element: <Profile />,
    },
    {
        path: "/profile/edit",
        element: <ProfileEdit />,
    },
    {
        path: "/admin",
        element: <AdminDashboard />,
    },
];

export default routes;
