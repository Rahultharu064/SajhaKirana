import Home from "@/pages/Publicwebsite/Home.tsx";
import CategoryProducts from "../pages/Publicwebsite/CategoryProducts.tsx";
import ProductDetail from "../pages/Publicwebsite/ProductDetail.tsx";
import PublicCategories from "../pages/Publicwebsite/Categories.tsx";
import PublicProducts from "../pages/Publicwebsite/Products.tsx";

import Register from "../components/Auth/Register.tsx";
import Login from "../components/Auth/Login.tsx";
import Profile from "../components/Auth/Profile.tsx";
import ProfileEdit from "../components/Auth/ProfileEdit.tsx";
import Cart from "../components/Publicwebsite/Cart/Cart.tsx";
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
import EditProduct from "../components/AdminDashboard/Forum/EditProduct.tsx";
import PaymentSuccess from "@/pages/Publicwebsite/PaymentSuccess.tsx";
import PaymentFailure from "@/pages/Publicwebsite/PaymentFailure.tsx";
import Checkout from "../pages/Publicwebsite/Checkout.tsx";
import OrderConfirmation from "../pages/Publicwebsite/OrderConfirmation.tsx";
import MyOrders from "../pages/Publicwebsite/MyOrders.tsx";

const routes = [
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/products",
        element: <PublicProducts />,
    },
    {
        path: "/category",
        element: <PublicCategories />,
    },
    {
        path: "/category/:name",
        element: <CategoryProducts />,
    },
    {
        path: "/product/:id",
        element: <ProductDetail />,
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
        path: "/cart",
        element: <Cart />,
    },
    {
        path: "/checkout",
        element: <Checkout />,
    },

    {
        path: "/payment/success",
        element: <PaymentSuccess />,
    },
    {
        path: "/payment/failure",
        element: <PaymentFailure />,
    },
    {
        path: "/order/confirmation/:id",
        element: <OrderConfirmation />,
    },
    {
        path: "/orders",
        element: <MyOrders />,
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
                path: "edit-product/:id",
                element: <EditProduct />
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
