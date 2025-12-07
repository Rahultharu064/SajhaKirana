import { Bell, Search, Moon, Sun } from "lucide-react";

type Props = {
  title?: string;
  dark: boolean;
  setDark: (v: boolean) => void;
};

export default function AdminHeader({ title = "Dashboard", dark, setDark }: Props) {
  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
      {/* Page Title / Breadcrumb */}
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden sm:block">
          <input
            type="text"
            placeholder="Search..."
            className="pl-8 pr-3 py-1 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <Search className="absolute left-2 top-1.5 text-gray-400 dark:text-gray-300" />
        </div>

        {/* Notifications */}
        <button type="button" aria-label="Notifications" className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Dark/Light toggle */}
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User avatar */}
        <div className="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-white text-sm font-semibold">
          AD
        </div>
      </div>
    </header>
  );
}
