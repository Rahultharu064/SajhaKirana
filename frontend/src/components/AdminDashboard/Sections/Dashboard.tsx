import { TrendingUp, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function Dashboard() {
  const kpiData = [
    { title: "Revenue", value: "$25,000", trend: "+12%", icon: <TrendingUp size={18} className="text-green-500" /> },
    { title: "Orders", value: "1,200", trend: "+8%", icon: <TrendingUp size={18} className="text-green-500" /> },
    { title: "Customers", value: "450", trend: "+5%", icon: <TrendingUp size={18} className="text-green-500" /> },
    { title: "Low Stock", value: "12", trend: "!", icon: <AlertTriangle size={18} className="text-red-500" /> },
  ];

  const salesData = [
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 3000 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 4000 },
    { month: "May", sales: 6000 },
  ];

  const topProducts = [
    { name: "Apple", sales: 2400 },
    { name: "Banana", sales: 1800 },
    { name: "Honey", sales: 1200 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi) => (
          <div key={kpi.title} className="bg-white dark:bg-gray-800 p-4 rounded shadow flex items-center gap-3">
            <div>{kpi.icon}</div>
            <div className="flex-1 flex flex-col">
              <span className="text-sm text-gray-500 dark:text-gray-300">{kpi.title}</span>
              <span className="text-xl font-bold">{kpi.value}</span>
              <span className={`text-xs ${kpi.trend.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                {kpi.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Sales Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="month" stroke="#8884d8" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#34D399" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Top Products</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="name" stroke="#8884d8" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#34D399" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <AlertTriangle size={18} className="text-red-500" /> Notifications
        </h3>
        <ul className="space-y-1 text-sm">
          <li className="text-red-500 flex items-center gap-2">
            <AlertTriangle size={14} /> Low-stock alert: Product ID 123
          </li>
          <li className="flex items-center gap-2">
            <TrendingUp size={14} className="text-green-500" /> New order received: Order #456
          </li>
          <li className="text-red-500 flex items-center gap-2">
            <AlertTriangle size={14} /> Low-stock alert: Product ID 789
          </li>
        </ul>
      </div>
    </div>
  );
}
