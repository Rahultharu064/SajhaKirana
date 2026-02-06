
import { Home, Box, ShoppingCart, Layers, Gift, Settings, Users, MessageSquare, Headphones, ChevronLeft, ChevronRight, LayoutDashboard, Package, Tag } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menu = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin/dashboard", color: "from-blue-500 to-indigo-600" },
    { name: "Products", icon: <Package size={20} />, path: "/admin/products", color: "from-purple-500 to-pink-600" },
    { name: "Orders", icon: <ShoppingCart size={20} />, path: "/admin/orders", color: "from-emerald-500 to-teal-600" },
    { name: "Users", icon: <Users size={20} />, path: "/admin/users", color: "from-orange-500 to-red-600" },
    { name: "Customer Service", icon: <Headphones size={20} />, path: "/admin/customer-service", color: "from-cyan-500 to-blue-600" },
    { name: "Reviews", icon: <MessageSquare size={20} />, path: "/admin/reviews", color: "from-yellow-500 to-orange-600" },
    { name: "Inventory", icon: <Layers size={20} />, path: "/admin/inventory", color: "from-green-500 to-emerald-600" },
    { name: "Categories", icon: <Tag size={20} />, path: "/admin/categories", color: "from-violet-500 to-purple-600" },
    { name: "Coupons", icon: <Gift size={20} />, path: "/admin/coupons", color: "from-pink-500 to-rose-600" },
    { name: "Promotions", icon: <Gift size={20} />, path: "/admin/promotions", color: "from-fuchsia-500 to-pink-600" },
    { name: "Settings", icon: <Settings size={20} />, path: "/admin/settings", color: "from-gray-500 to-slate-600" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-72'} bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 flex flex-col transition-all duration-300 ease-in-out shadow-2xl relative`}>
      {/* Logo Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <LayoutDashboard className="text-white" size={22} />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">Sajha Kirana</h1>
              <p className="text-xs text-slate-400">Admin Portal</p>
            </div>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 border-2 border-slate-900 z-10"
        title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {collapsed ? <ChevronRight size={14} className="text-white" /> : <ChevronLeft size={14} className="text-white" />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
        {menu.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                group relative flex items-center gap-3 w-full px-4 py-3.5 rounded-xl
                transition-all duration-200 ease-in-out
                ${active 
                  ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg transform scale-[1.02]' 
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
              title={collapsed ? item.name : ''}
            >
              {/* Active Indicator */}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
              )}
              
              {/* Icon */}
              <div className={`flex-shrink-0 ${active ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'} transition-colors`}>
                {item.icon}
              </div>
              
              {/* Label */}
              {!collapsed && (
                <span className="font-medium text-sm tracking-wide">
                  {item.name}
                </span>
              )}

              {/* Hover Effect */}
              {!active && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-semibold shadow-lg">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-slate-400 truncate">admin@sajhakirana.com</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}