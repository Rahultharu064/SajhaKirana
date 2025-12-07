import { useState } from 'react';
import Sidebar from '../../components/AdminDashboard/Layouts/Sidebar';
import AdminHeader from '../../components/AdminDashboard/Layouts/AdminHeader';
import Dashboard from '../../components/AdminDashboard/Sections/Dashboard';
import Products from '../../components/AdminDashboard/Sections/Products';
import Orders from '../../components/AdminDashboard/Sections/Orders';
import Inventory from '../../components/AdminDashboard/Sections/Inventory';
import Coupons from '../../components/AdminDashboard/Sections/Coupons';
import Promotions from '../../components/AdminDashboard/Sections/Promotions';
import Settings from '../../components/AdminDashboard/Sections/Settings';

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [dark, setDark] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "products":
        return <Products />;
      case "orders":
        return <Orders />;
      case "inventory":
        return <Inventory />;
      case "coupons":
        return <Coupons />;
      case "promotions":
        return <Promotions />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 ${dark ? 'dark' : ''}`}>
      <AdminHeader title={activePage.charAt(0).toUpperCase() + activePage.slice(1)} dark={dark} setDark={setDark} />
      <div className="flex">
        <Sidebar activePage={activePage} setActivePage={setActivePage} dark={dark} setDark={setDark} />
        <main className="flex-1">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
