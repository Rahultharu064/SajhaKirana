import Home from "@/pages/Publicwebsite/Home.tsx";
import Register from "../components/Auth/Register.tsx";
import Login from "../components/Auth/Login.tsx";
import Profile from "../components/Auth/Profile.tsx";
import ProfileEdit from "../components/Auth/ProfileEdit.tsx";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard.tsx";
import { Navigate } from "react-router-dom";
import Dashboard from "../components/AdminDashboard/Sections/Dashboard.tsx";
import Products from "../components/AdminDashboard/Sections/Products.tsx";
import Orders from "../components/AdminDashboard/Sections/Orders.tsx";
import Inventory from "../components/AdminDashboard/Sections/Inventory.tsx";
import Coupons from "../components/AdminDashboard/Sections/Coupons.tsx";
import Promotions from "../components/AdminDashboard/Sections/Promotions.tsx";
import Settings from "../components/AdminDashboard/Sections/Settings.tsx";
import Categories from "../components/AdminDashboard/Sections/Categories.tsx";
import CreateProduct from "../components/AdminDashboard/Forum/CreateProduct.tsx";

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
    // Admin Routes
    {
        path: "/admin",
        element: <AdminDashboard />,
        children: [
            {
                index: true,
                element: <Navigate to="/admin/dashboard" replace />
            },
            {
                path: "dashboard",
                element: <Dashboard />
            },
            {
                path: "products",
                element: <Products />
            },
            {
                path: "create-product",
                element: <CreateProduct />
            },
            {
                path: "orders",
                element: <Orders />
            },
            {
                path: "inventory",
                element: <Inventory />
            },
            {
                path: "coupons",
                element: <Coupons />
            },
            {
                path: "promotions",
                element: <Promotions />
            },
            {
                path: "categories",
                element: <Categories />
            },
            {
                path: "settings",
                element: <Settings />
            }
        ]
    }
];

export default routes;
