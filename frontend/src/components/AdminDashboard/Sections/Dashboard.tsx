import { TrendingUp, AlertTriangle, DollarSign, ShoppingCart, Users, Package, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from "recharts";

export default function Dashboard() {
  const kpiData = [
    { 
      title: "Total Revenue", 
      value: "Rs. 2,45,000", 
      trend: "+12.5%", 
      trendDirection: "up",
      icon: DollarSign,
      bgGradient: "from-emerald-500 to-teal-600",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      change: "+Rs. 27,000"
    },
    { 
      title: "Total Orders", 
      value: "1,284", 
      trend: "+8.2%", 
      trendDirection: "up",
      icon: ShoppingCart,
      bgGradient: "from-blue-500 to-indigo-600",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      change: "+94 orders"
    },
    { 
      title: "Active Users", 
      value: "486", 
      trend: "+5.7%", 
      trendDirection: "up",
      icon: Users,
      bgGradient: "from-purple-500 to-pink-600",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      change: "+26 users"
    },
    { 
      title: "Low Stock Items", 
      value: "12", 
      trend: "-3 items", 
      trendDirection: "down",
      icon: AlertTriangle,
      bgGradient: "from-orange-500 to-red-600",
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
      iconColor: "text-orange-600 dark:text-orange-400",
      change: "Requires attention"
    },
  ];

  const salesData = [
    { month: "Jan", sales: 45000, orders: 120, revenue: 42000 },
    { month: "Feb", sales: 38000, orders: 98, revenue: 35000 },
    { month: "Mar", sales: 52000, orders: 142, revenue: 49000 },
    { month: "Apr", sales: 48000, orders: 128, revenue: 45000 },
    { month: "May", sales: 61000, orders: 165, revenue: 58000 },
    { month: "Jun", sales: 55000, orders: 148, revenue: 52000 },
  ];

  const topProducts = [
    { name: "Basmati Rice", sales: 2840, revenue: 42600 },
    { name: "Cooking Oil", sales: 2150, revenue: 32250 },
    { name: "Dal", sales: 1890, revenue: 28350 },
    { name: "Sugar", sales: 1650, revenue: 24750 },
    { name: "Wheat Flour", sales: 1420, revenue: 21300 },
  ];

  const recentActivities = [
    { type: "order", message: "New order #12847 received", time: "2 min ago", status: "success" },
    { type: "stock", message: "Low stock alert: Basmati Rice", time: "15 min ago", status: "warning" },
    { type: "user", message: "New user registration: Ram Kumar", time: "1 hour ago", status: "info" },
    { type: "payment", message: "Payment confirmed for order #12846", time: "2 hours ago", status: "success" },
    { type: "stock", message: "Product restocked: Cooking Oil", time: "3 hours ago", status: "info" },
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced KPI Cards with Animations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          const isPositive = kpi.trendDirection === "up";
          
          return (
            <div 
              key={kpi.title} 
              className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 dark:border-slate-700/50 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient Background Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${kpi.bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${kpi.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`${kpi.iconColor}`} size={24} />
                  </div>
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    isPositive 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {kpi.trend}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-1">
                    {kpi.title}
                  </p>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                    {kpi.value}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    {kpi.change}
                  </p>
                </div>
              </div>

              {/* Decorative Element */}
              <div className={`absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br ${kpi.bgGradient} rounded-full opacity-10 group-hover:opacity-20 transition-opacity blur-2xl`} />
            </div>
          );
        })}
      </div>

      {/* Charts Section with Modern Design */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="text-emerald-600" size={20} />
                Sales Performance
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Monthly revenue and order trends</p>
            </div>
            <select className="px-3 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
              <option>Last 6 Months</option>
              <option>Last Year</option>
              <option>All Time</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
              <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: '#fff',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                }}
              />
              <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700/50">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Package className="text-purple-600" size={20} />
            Top Products
          </h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-sm">
                  #{index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{product.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Rs. {product.revenue.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{product.sales}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">units</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700/50">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="text-blue-600" size={20} />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className={`p-2 rounded-lg ${
                  activity.status === 'success' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                  activity.status === 'warning' ? 'bg-orange-100 dark:bg-orange-900/30' :
                  'bg-blue-100 dark:bg-blue-900/30'
                }`}>
                  {activity.status === 'success' && <TrendingUp className="text-emerald-600" size={16} />}
                  {activity.status === 'warning' && <AlertTriangle className="text-orange-600" size={16} />}
                  {activity.status === 'info' && <Activity className="text-blue-600" size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900 dark:text-white font-medium">{activity.message}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-lg text-white overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <TrendingUp size={20} />
              Quick Overview
            </h3>
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-sm opacity-90 mb-1">Today's Revenue</p>
                <p className="text-2xl font-bold">Rs. 8,450</p>
                <p className="text-xs opacity-75 mt-1">+18% from yesterday</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-sm opacity-90 mb-1">Pending Orders</p>
                <p className="text-2xl font-bold">24</p>
                <p className="text-xs opacity-75 mt-1">8 orders in processing</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-sm opacity-90 mb-1">Customer Satisfaction</p>
                <p className="text-2xl font-bold">4.8/5</p>
                <p className="text-xs opacity-75 mt-1">Based on 284 reviews</p>
              </div>
            </div>
          </div>
          {/* Decorative Elements */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
}