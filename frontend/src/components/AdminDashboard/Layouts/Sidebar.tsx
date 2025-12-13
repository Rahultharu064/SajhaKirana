
import { Home, Box, ShoppingCart, Layers, Gift, Settings, Users } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Dashboard", icon: <Home size={18} />, path: "/admin/dashboard" },
    { name: "Products", icon: <Box size={18} />, path: "/admin/products" },
    { name: "Orders", icon: <ShoppingCart size={18} />, path: "/admin/orders" },
    { name: "Users", icon: <Users size={18} />, path: "/admin/users" },
    { name: "Inventory", icon: <Layers size={18} />, path: "/admin/inventory" },
    { name: "Categories", icon: <Layers size={18} />, path: "/admin/categories" },
    { name: "Coupons", icon: <Gift size={18} />, path: "/admin/coupons" },
    { name: "Promotions", icon: <Gift size={18} />, path: "/admin/promotions" },
    { name: "Settings", icon: <Settings size={18} />, path: "/admin/settings" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <span className="font-bold text-xl">Admin</span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-3 w-full p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
              isActive(item.path) ? "bg-emerald-500 text-white hover:bg-emerald-600" : ""
            }`}
          >
            {item.icon}
            {item.name}
          </button>
        ))}
      </nav>
    </aside>
  );
}
