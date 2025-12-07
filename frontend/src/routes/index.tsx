
import Register from "../components/Auth/Register.tsx";
import Login from "../components/Auth/Login.tsx";
import Profile from "../components/Profile.tsx";
import ProfileEdit from "../components/Auth/ProfileEdit.tsx";

const routes = [
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
];

export default routes;
