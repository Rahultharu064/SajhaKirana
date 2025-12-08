import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/AdminDashboard/Layouts/Sidebar';
import AdminHeader from '../../components/AdminDashboard/Layouts/AdminHeader';

export default function AdminDashboard() {
  const [dark, setDark] = useState(false);
  const location = useLocation();

  // Extract page title from pathname
  const getPageTitle = (pathname: string) => {
    const path = pathname.replace('/admin/', '');
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 ${dark ? 'dark' : ''}`}>
      <AdminHeader title={getPageTitle(location.pathname)} dark={dark} setDark={setDark} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
