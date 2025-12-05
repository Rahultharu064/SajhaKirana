

import React, { useState } from 'react';
import {
  LayoutDashboard, Package, ShoppingCart, Box, Tag, Megaphone,
  Settings, Menu, X, Search, Bell, User, ChevronDown, Plus,
  Filter, Download, Upload, Edit2, Trash2, Copy, Eye, MoreVertical,
  TrendingUp, TrendingDown, AlertCircle, CheckCircle, Clock,
  DollarSign, Users, PackageX, ArrowUpRight, Calendar, ChevronRight,
  Save, ExternalLink, BarChart3, TrendingDownIcon
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

// Mock Data
const dashboardData = {
  kpis: [
    { label: 'Revenue', value: '$45,231', change: '+12.5%', trend: 'up', sparkline: [30, 40, 35, 50, 49, 60, 70] },
    { label: 'Total Orders', value: '1,234', change: '+8.2%', trend: 'up', sparkline: [20, 30, 25, 40, 45, 50, 48] },
    { label: 'Customers', value: '892', change: '+15.3%', trend: 'up', sparkline: [10, 15, 20, 18, 25, 30, 35] },
    { label: 'Low Stock', value: '23', change: '-5 items', trend: 'down', sparkline: [40, 38, 35, 30, 28, 25, 23] },
  ],
  salesData: [
    { date: 'Jan', sales: 4000 },
    { date: 'Feb', sales: 3000 },
    { date: 'Mar', sales: 5000 },
    { date: 'Apr', sales: 4500 },
    { date: 'May', sales: 6000 },
    { date: 'Jun', sales: 5500 },
  ],
  topProducts: [
    { name: 'Product A', sales: 4500 },
    { name: 'Product B', sales: 3800 },
    { name: 'Product C', sales: 3200 },
    { name: 'Product D', sales: 2800 },
  ],
  recentOrders: [
    { id: '#ORD-001', customer: 'John Doe', amount: '$234.00', status: 'completed', date: '2025-12-01' },
    { id: '#ORD-002', customer: 'Jane Smith', amount: '$456.00', status: 'processing', date: '2025-12-02' },
    { id: '#ORD-003', customer: 'Bob Johnson', amount: '$789.00', status: 'pending', date: '2025-12-03' },
  ],
  notifications: [
    { type: 'warning', message: '5 products are low on stock', time: '2 hours ago' },
    { type: 'success', message: 'New order received (#ORD-004)', time: '3 hours ago' },
    { type: 'info', message: 'System backup completed', time: '1 day ago' },
  ],
  products: [
    { id: 1, name: 'Premium Headphones', sku: 'PRD-001', price: '$299.00', stock: 45, status: 'active', image: '🎧' },
    { id: 2, name: 'Wireless Mouse', sku: 'PRD-002', price: '$49.99', stock: 12, status: 'active', image: '🖱️' },
    { id: 3, name: 'Mechanical Keyboard', sku: 'PRD-003', price: '$159.00', stock: 8, status: 'low', image: '⌨️' },
    { id: 4, name: 'USB-C Hub', sku: 'PRD-004', price: '$79.99', stock: 0, status: 'out', image: '🔌' },
  ],
  orders: [
    { id: '#ORD-001', customer: 'John Doe', email: 'john@example.com', amount: '$234.00', status: 'completed', payment: 'Credit Card', date: '2025-12-01', items: 3 },
    { id: '#ORD-002', customer: 'Jane Smith', email: 'jane@example.com', amount: '$456.00', status: 'processing', payment: 'PayPal', date: '2025-12-02', items: 5 },
    { id: '#ORD-003', customer: 'Bob Johnson', email: 'bob@example.com', amount: '$789.00', status: 'pending', payment: 'Credit Card', date: '2025-12-03', items: 2 },
  ],
  inventory: [
    { sku: 'PRD-001', product: 'Premium Headphones', stock: 45, warehouse: 'Main', status: 'good' },
    { sku: 'PRD-002', product: 'Wireless Mouse', stock: 12, warehouse: 'Main', status: 'low' },
    { sku: 'PRD-003', product: 'Mechanical Keyboard', stock: 8, warehouse: 'Secondary', status: 'low' },
    { sku: 'PRD-004', product: 'USB-C Hub', stock: 0, warehouse: 'Main', status: 'out' },
  ],
  coupons: [
    { code: 'SAVE20', discount: '20%', type: 'Percentage', usage: '45/100', expires: '2025-12-31', status: 'active' },
    { code: 'FREESHIP', discount: 'Free Shipping', type: 'Shipping', usage: '∞', expires: '2025-12-31', status: 'active' },
    { code: 'WELCOME10', discount: '$10', type: 'Fixed', usage: '120/500', expires: '2025-12-31', status: 'active' },
    { code: 'HALLOWEEN', discount: '15%', type: 'Percentage', usage: '500/500', expires: '2025-10-31', status: 'expired' },
  ],
  promotions: [
    { id: 1, name: 'Holiday Sale', type: 'Storewide', start: '2025-12-15', end: '2025-12-31', status: 'scheduled' },
    { id: 2, name: 'Free Gift over $100', type: 'Cart Rule', start: '2025-11-01', end: '2025-11-30', status: 'active' },
  ],
};

// Reusable Components
const Button = ({ children, variant = 'primary', size = 'md', icon, className = '', ...props }) => {
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700',
    ghost: 'hover:bg-gray-100 text-gray-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-200 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

const Card = ({ children, className = '', hover = false }) => (
  <div className={`bg-white rounded-xl border border-gray-200 ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''} ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

const Input = ({ label, icon, className = '', ...props }) => (
  <div className={className}>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
      <input
        className={`w-full px-4 py-2.5 ${icon ? 'pl-10' : ''} border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
        {...props}
      />
    </div>
  </div>
);

const Select = ({ label, options, className = '', ...props }) => (
  <div className={className}>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
    <select
      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
      {...props}
    >
      {options.map((opt, i) => (
        <option key={i} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const Sparkline = ({ data }) => (
  <div className="h-8 w-20">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data.map((v, i) => ({ v }))}>
        <defs>
          <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke="#4F46E5" fill="url(#sparkGradient)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {children}
        </div>
        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

const Toast = ({ message, type = 'success', onClose }) => {
  const icons = {
    success: <CheckCircle className="text-green-500" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
    warning: <AlertCircle className="text-yellow-500" size={20} />,
    info: <AlertCircle className="text-blue-500" size={20} />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-center gap-3 min-w-[300px]">
        {icons[type]}
        <span className="text-sm text-gray-700 flex-1">{message}</span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

const Tabs = ({ tabs, activeTab, onChange }) => (
  <div className="border-b border-gray-200">
    <div className="flex gap-8">
      {tabs.map((tab, i) => (
        <button
          key={i}
          onClick={() => onChange(tab.id)}
          className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
            activeTab === tab.id
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  </div>
);

// Main Dashboard Component
const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventory', icon: Box },
    { id: 'coupons', label: 'Coupons', icon: Tag },
    { id: 'promotions', label: 'Promotions', icon: Megaphone },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Dashboard Page
  const DashboardPage = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardData.kpis.map((kpi, i) => (
          <Card key={i} hover className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">{kpi.label}</p>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              </div>
              <Sparkline data={kpi.sparkline} />
            </div>
            <div className="flex items-center gap-2">
              {kpi.trend === 'up' ? (
                <TrendingUp className="text-green-500" size={16} />
              ) : (
                <TrendingDown className="text-red-500" size={16} />
              )}
              <span className={`text-sm font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.change}
              </span>
              <span className="text-sm text-gray-500">vs last month</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
            <Select
              options={[
                { value: '7d', label: 'Last 7 days' },
                { value: '30d', label: 'Last 30 days' },
                { value: '90d', label: 'Last 90 days' },
              ]}
              className="w-40"
            />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dashboardData.salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#4F46E5" strokeWidth={2} dot={{ fill: '#4F46E5', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Products</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dashboardData.topProducts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Bar dataKey="sales" fill="#4F46E5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Notifications & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            {dashboardData.notifications.map((notif, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150">
                <div className={`p-2 rounded-lg ${
                  notif.type === 'warning' ? 'bg-yellow-100' :
                    notif.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                  <AlertCircle size={16} className={
                    notif.type === 'warning' ? 'text-yellow-600' :
                      notif.type === 'success' ? 'text-green-600' : 'text-blue-600'
                    } />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{notif.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <Button variant="ghost" size="sm" onClick={() => setCurrentPage('orders')}>
              View All <ChevronRight size={16} />
            </Button>
          </div>
          <div className="space-y-3">
            {dashboardData.recentOrders.map((order, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <ShoppingCart className="text-indigo-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.id}</p>
                    <p className="text-xs text-gray-500">{order.customer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{order.amount}</p>
                  <Badge variant={
                    order.status === 'completed' ? 'success' :
                      order.status === 'processing' ? 'info' : 'warning'
                  }>
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  // Products Page
  const ProductsPage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your product catalog</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={<Upload size={18} />}>Import CSV</Button>
          <Button icon={<Plus size={18} />} onClick={() => setModalOpen(true)}>Add Product</Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
          <Input icon={<Search size={18} />} placeholder="Search products..." className="flex-1" />
          <Select options={[
            { value: 'all', label: 'All Categories' },
            { value: 'electronics', label: 'Electronics' },
            { value: 'accessories', label: 'Accessories' },
          ]} className="w-full sm:w-48" />
          <Button variant="outline" icon={<Filter size={18} />}>Filter</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left"><input type="checkbox" className="rounded" /></th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dashboardData.products.map((product, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-4 py-4"><input type="checkbox" className="rounded" /></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">
                        {product.image}
                      </div>
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{product.sku}</td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{product.price}</td>
                  <td className="px-4 py-4">
                    <span className={`text-sm font-medium ${
                      product.stock === 0 ? 'text-red-600' :
                        product.stock < 10 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={
                      product.status === 'active' ? 'success' :
                        product.status === 'low' ? 'warning' : 'error'
                    }>
                      {product.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150">
                        <Edit2 size={16} className="text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150">
                        <Copy size={16} className="text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150">
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Product Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Product"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              setModalOpen(false);
              showToast('Product added successfully!');
            }}>Create Product</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Product Name" placeholder="Enter product name" />
          <Input label="SKU" placeholder="Enter SKU" />
          <Input label="Price" type="number" placeholder="0.00" />
          <Input label="Stock Quantity" type="number" placeholder="0" />
          <Select label="Category" options={[
            { value: 'electronics', label: 'Electronics' },
            { value: 'accessories', label: 'Accessories' },
          ]} />
        </div>
      </Modal>
    </div>
  );

  // Orders Page
  const OrdersPage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-600 mt-1">Track and manage customer orders</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={<Download size={18} />}>Export</Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
          <Input icon={<Search size={18} />} placeholder="Search orders..." className="flex-1" />
          <Select options={[
            { value: 'all', label: 'All Status' },
            { value: 'pending', label: 'Pending' },
            { value: 'processing', label: 'Processing' },
            { value: 'completed', label: 'Completed' },
          ]} className="w-full sm:w-48" />
          <Button variant="outline" icon={<Calendar size={18} />}>Date Range</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dashboardData.orders.map((order, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                      <p className="text-xs text-gray-500">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{order.amount}</td>
                  <td className="px-4 py-4">
                    <Badge variant={
                      order.status === 'completed' ? 'success' :
                        order.status === 'processing' ? 'info' : 'warning'
                    }>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{order.payment}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{order.date}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" icon={<Eye size={16} />} onClick={() => showToast(`Viewing Order ${order.id}`, 'info')}>View</Button>
                      <Button variant="outline" size="sm" icon={<MoreVertical size={16} />}>More</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  // Inventory Page (COMPLETED)
  const InventoryPage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-600 mt-1">Monitor and manage stock levels across warehouses</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={<ArrowUpRight size={18} />}>Stock Transfer</Button>
          <Button icon={<Plus size={18} />}>Receive Stock</Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
          <Input icon={<Search size={18} />} placeholder="Search SKU or product..." className="flex-1" />
          <Select options={[
            { value: 'all', label: 'All Warehouses' },
            { value: 'main', label: 'Main Warehouse' },
            { value: 'secondary', label: 'Secondary Warehouse' },
          ]} className="w-full sm:w-48" />
          <Button variant="outline" icon={<Filter size={18} />}>Filter</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Warehouse</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dashboardData.inventory.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{item.sku}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{item.product}</td>
                  <td className="px-4 py-4">
                    <span className={`text-sm font-medium ${
                      item.stock === 0 ? 'text-red-600' :
                        item.stock < 15 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                      {item.stock} units
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{item.warehouse}</td>
                  <td className="px-4 py-4">
                    <Badge variant={
                      item.status === 'good' ? 'success' :
                        item.status === 'low' ? 'warning' : 'error'
                    }>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" icon={<Edit2 size={16} />} onClick={() => showToast(`Adjusting Stock for ${item.product}`, 'info')}>Adjust</Button>
                      <Button variant="outline" size="sm" icon={<PackageX size={16} />}>Remove</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  // Coupons Page (COMPLETED)
  const CouponsPage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
          <p className="text-sm text-gray-600 mt-1">Create and manage discount codes</p>
        </div>
        <div className="flex items-center gap-3">
          <Button icon={<Plus size={18} />} onClick={() => setModalOpen(true)}>Add Coupon</Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
          <Input icon={<Search size={18} />} placeholder="Search coupon code..." className="flex-1" />
          <Select options={[
            { value: 'all', label: 'All Types' },
            { value: 'percentage', label: 'Percentage' },
            { value: 'fixed', label: 'Fixed Amount' },
            { value: 'shipping', label: 'Free Shipping' },
          ]} className="w-full sm:w-48" />
          <Button variant="outline" icon={<Filter size={18} />}>Filter</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Discount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Usage</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Expires</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dashboardData.coupons.map((coupon, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-4 py-4 text-sm font-bold text-indigo-600">{coupon.code}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{coupon.discount}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{coupon.type}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{coupon.usage}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{coupon.expires}</td>
                  <td className="px-4 py-4">
                    <Badge variant={coupon.status === 'active' ? 'success' : 'error'}>
                      {coupon.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" icon={<Edit2 size={16} />} onClick={() => showToast(`Editing Coupon ${coupon.code}`, 'info')}>Edit</Button>
                      <Button variant="danger" size="sm" icon={<Trash2 size={16} />}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Coupon Modal - Reuse Product Modal state for simplicity */}
      <Modal
        isOpen={modalOpen && currentPage === 'coupons'}
        onClose={() => setModalOpen(false)}
        title="Create New Coupon"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              setModalOpen(false);
              showToast('Coupon created successfully!');
            }}>Save Coupon</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Coupon Code" placeholder="E.g., SUMMER25" />
          <Input label="Discount Value" type="text" placeholder="E.g., 25% or $10" />
          <Select label="Discount Type" options={[
            { value: 'percentage', label: 'Percentage Discount' },
            { value: 'fixed', label: 'Fixed Amount Discount' },
            { value: 'shipping', label: 'Free Shipping' },
          ]} />
          <Input label="Expiration Date" type="date" />
        </div>
      </Modal>
    </div>
  );

  // Promotions Page (COMPLETED)
  const PromotionsPage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promotions</h1>
          <p className="text-sm text-gray-600 mt-1">Manage global sales, banners, and marketing events</p>
        </div>
        <Button icon={<Plus size={18} />} onClick={() => showToast('Starting new promotion creation...', 'info')}>New Promotion</Button>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Active and Scheduled Campaigns</h2>
        <div className="space-y-4">
          {dashboardData.promotions.map((promo, i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <Megaphone size={24} className="text-indigo-600" />
                <div>
                  <p className="font-medium text-gray-900">{promo.name}</p>
                  <p className="text-sm text-gray-500">Type: {promo.type} | Dates: {promo.start} - {promo.end}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={
                  promo.status === 'active' ? 'success' :
                    promo.status === 'scheduled' ? 'info' : 'error'
                }>
                  {promo.status}
                </Badge>
                <Button variant="outline" size="sm" icon={<Edit2 size={16} />}>Edit</Button>
                <Button variant="ghost" size="sm" icon={<Trash2 size={16} />} className="text-red-600 hover:bg-red-50" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><BarChart3 size={20} /> Traffic Analytics</h3>
          <p className="text-3xl font-bold text-gray-900">12,450</p>
          <p className="text-sm text-gray-500">Visitors this month</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><DollarSign size={20} /> Conversion Rate</h3>
          <p className="text-3xl font-bold text-green-600">3.8%</p>
          <p className="text-sm text-gray-500">Up 0.5% from last month</p>
        </Card>
      </div>
    </div>
  );

  // Settings Page (COMPLETED)
  const SettingsPage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-600 mt-1">Configure your store details and preferences</p>
        </div>
        <Button icon={<Save size={18} />} onClick={() => showToast('Settings saved successfully!')}>Save Settings</Button>
      </div>

      <Card className="p-6">
        <Tabs
          tabs={[
            { id: 'general', label: 'General' },
            { id: 'payments', label: 'Payments' },
            { id: 'shipping', label: 'Shipping' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
        <div className="pt-6 space-y-6">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Store Details</h2>
              <Input label="Store Name" defaultValue="E-Commerce Admin" />
              <Input label="Store Email" type="email" defaultValue="admin@ecommerce.com" />
              <Select label="Default Currency" options={[
                { value: 'usd', label: 'USD ($)' },
                { value: 'eur', label: 'EUR (€)' },
              ]} defaultValue="usd" />
            </div>
          )}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Payment Gateways</h2>
              <div className="border p-4 rounded-lg flex items-center justify-between">
                <p className="font-medium">Stripe Integration</p>
                <Button variant="secondary">Configure</Button>
              </div>
              <div className="border p-4 rounded-lg flex items-center justify-between">
                <p className="font-medium">PayPal</p>
                <Badge variant="success">Active</Badge>
              </div>
            </div>
          )}
          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Shipping Zones</h2>
              <div className="border p-4 rounded-lg flex items-center justify-between">
                <p className="font-medium">US Domestic</p>
                <Button variant="secondary">Edit Zones</Button>
              </div>
              <div className="border p-4 rounded-lg flex items-center justify-between">
                <p className="font-medium">International</p>
                <Badge variant="warning">Review</Badge>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );

  // --- Main Structure Logic ---

  // Function to render the active page component (COMPLETED)
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'products':
        return <ProductsPage />;
      case 'orders':
        return <OrdersPage />;
      case 'inventory':
        return <InventoryPage />;
      case 'coupons':
        return <CouponsPage />;
      case 'promotions':
        return <PromotionsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 antialiased">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 shadow-xl lg:static lg:shadow-none transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-0 lg:w-20'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className={`flex items-center gap-2 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
            <Box size={24} className="text-indigo-600" />
            <span className="text-xl font-bold text-gray-900 whitespace-nowrap">Admin Panel</span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
            {sidebarOpen ? <X size={20} className="lg:hidden" /> : <Menu size={20} className="lg:hidden" />}
            <ChevronDown size={20} className="hidden lg:block transform rotate-90" />
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-2">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id);
                setSidebarOpen(false);
              }}
              className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                currentPage === item.id
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon size={20} className={sidebarOpen ? 'shrink-0' : 'mx-auto'} />
              <span className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ${sidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* Header (Top Bar) */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden">
                <Menu size={20} />
              </button>
              <Input
                icon={<Search size={18} />}
                placeholder="Search anything..."
                className="hidden lg:block w-96"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User size={18} className="text-indigo-600" />
                </div>
                <div className="hidden sm:block text-sm font-medium text-gray-700">
                  Admin User
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {renderPage()}
        </main>
      </div>

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default App;