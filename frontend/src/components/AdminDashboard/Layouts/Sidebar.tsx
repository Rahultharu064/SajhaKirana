
import { Home, Box, ShoppingCart, Layers, Gift, Settings } from "lucide-react";

type Props = {
  activePage: string;
  setActivePage: (page: string) => void;
  dark: boolean;
  setDark: (v: boolean) => void;
};

export default function Sidebar({ activePage, setActivePage }: Props) {
  const menu = [
    { name: "Dashboard", icon: <Home size={18} />, key: "dashboard" },
    { name: "Products", icon: <Box size={18} />, key: "products" },
    { name: "Orders", icon: <ShoppingCart size={18} />, key: "orders" },
    { name: "Inventory", icon: <Layers size={18} />, key: "inventory" },
    { name: "Coupons", icon: <Gift size={18} />, key: "coupons" },
    { name: "Promotions", icon: <Gift size={18} />, key: "promotions" },
    { name: "Settings", icon: <Settings size={18} />, key: "settings" },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <span className="font-bold text-xl">Admin</span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item) => (
          <button
            key={item.key}
            onClick={() => setActivePage(item.key)}
            className={`flex items-center gap-3 w-full p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
              activePage === item.key ? "bg-emerald-500 text-white" : ""
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
