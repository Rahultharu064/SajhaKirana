import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/AdminDashboard/Layouts/Sidebar';
import AdminHeader from '../../components/AdminDashboard/Layouts/AdminHeader';
import ChatFloatingButton from '../../components/chatbot/ChatFloatingButton';

export default function AdminDashboard() {
  const [dark, setDark] = useState(false);
  const location = useLocation();

  // Extract page title from pathname
  const getPageTitle = (pathname: string) => {
    const path = pathname.replace('/admin/', '').replace('-', ' ');
    return path.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 antialiased dark:text-slate-100 ${
        dark ? 'dark' : ''
      }`}
    >
      <AdminHeader title={getPageTitle(location.pathname)} dark={dark} setDark={setDark} />
      <div className="flex min-h-[calc(100vh-73px)]">
        <Sidebar />
        <main className="flex-1 px-8 pb-10 pt-8 overflow-auto">
          {/* Content Container with subtle background */}
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <ChatFloatingButton />
    </div>
  );
}
