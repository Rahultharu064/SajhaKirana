import { useEffect, useState } from 'react';
import Table from '../Layouts/Table';
import { Eye, Edit, ShoppingCart, Clock, Package, CheckCircle, Filter } from 'lucide-react';
import { orderService } from '../../../services/orderService';
import toast from 'react-hot-toast';
import Modal from '../../ui/Modal';
import OrderDetailsView from '../../Publicwebsite/Order/OrderDetailsView';
import Button from '../../ui/Button';

interface Order {
  id: number;
  user?: {
    name: string;
    email: string;
  };
  orderStatus: string;
  total: number;
  paymentMethod: string;
  createdAt: string;
}

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [editingOrder, setEditingOrder] = useState<number | null>(null);
  const [statusForm, setStatusForm] = useState({ status: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAllOrders({ status: statusFilter });
      if (response.data && response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
      toast.error("Could not load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800';
      case 'shipped': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800';
      case 'processing': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800';
      case 'confirmed': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800';
      case 'pending': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700';
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700';
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      await orderService.updateOrderStatus(id, newStatus);
      toast.success(`Order #${id} status updated to ${newStatus}`);
      fetchOrders(); // Refresh list
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update order status");
    }
  };

  const handleStatusFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    try {
      setSubmitting(true);
      await orderService.updateOrderStatus(editingOrder, statusForm.status, statusForm.notes);
      toast.success(`Order #${editingOrder} status updated successfully`);
      setEditingOrder(null);
      setStatusForm({ status: '', notes: '' });
      fetchOrders();
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update order status");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (order: Order) => {
    setEditingOrder(order.id);
    setStatusForm({ status: order.orderStatus, notes: '' });
  };

  // Format data for Table component
  const tableData = orders.map(order => ({
    'Order ID': `#${order.id}`,
    'Customer': (
      <div>
        <p className="font-medium text-gray-900">{order.user?.name || 'Guest'}</p>
        <p className="text-xs text-gray-500">{order.user?.email}</p>
      </div>
    ),
    'Date': new Date(order.createdAt).toLocaleDateString(),
    'Status': (
      <select
        value={order.orderStatus}
        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
        className={`px-2 py-1 rounded-full text-xs font-semibold border-none focus:ring-2 focus:ring-emerald-500 cursor-pointer ${getStatusColor(order.orderStatus)}`}
        onClick={(e) => e.stopPropagation()}
      >
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
    ),
    'Total': <span className="font-medium">Rs. {order.total}</span>,
    'Payment': <span className="capitalize text-gray-600 text-sm">{order.paymentMethod}</span>,
    originalId: order.id // hidden, used for actions
  }));

  // Order stats
  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.orderStatus === 'pending').length,
    processing: orders.filter(o => o.orderStatus === 'processing').length,
    delivered: orders.filter(o => o.orderStatus === 'delivered').length,
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Order Management</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Track and manage all customer orders</p>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{orderStats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <ShoppingCart className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-1">Pending</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{orderStats.pending}</p>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                <Clock className="text-amber-600 dark:text-amber-400" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-1">Processing</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{orderStats.processing}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Package className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-1">Delivered</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{orderStats.delivered}</p>
              </div>
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                <CheckCircle className="text-emerald-600 dark:text-emerald-400" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700/50 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="text-slate-400" size={18} />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter Orders:</span>
            </div>
            <select
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <Table
          columns={['Order ID', 'Customer', 'Date', 'Status', 'Total', 'Payment']}
          data={tableData}
          actions={(row: any) => {
            const orderId = row.originalId;
            const order = orders.find(o => o.id === orderId);
            return (
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedOrder(orderId)}
                  className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors"
                  title="View Details"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => order && openEditModal(order)}
                  className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                  title="Update Status"
                >
                  <Edit size={18} />
                </button>
              </div>
            );
          }}
        />
      )}

      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order Details #${selectedOrder}`}
      >
        {selectedOrder && (
          <div className="p-4">
            <OrderDetailsView orderId={selectedOrder} />
          </div>
        )}
      </Modal>

      {/* Status Update Modal */}
      <Modal
        isOpen={!!editingOrder}
        onClose={() => {
          setEditingOrder(null);
          setStatusForm({ status: '', notes: '' });
        }}
        title={`Update Order Status #${editingOrder}`}
      >
        {editingOrder && (
          <form onSubmit={handleStatusFormSubmit} className="space-y-6 p-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Status
              </label>
              <select
                value={statusForm.status}
                onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notes (Optional)
              </label>
              <textarea
                value={statusForm.notes}
                onChange={(e) => setStatusForm({ ...statusForm, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                rows={4}
                placeholder="Add notes about this status change..."
              />
              <p className="text-xs text-gray-500 mt-1">
                These notes will be saved in the order history and sent to the customer via email.
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingOrder(null);
                  setStatusForm({ status: '', notes: '' });
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {submitting ? 'Updating...' : 'Update Status'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default Orders;
