import { useEffect, useState } from 'react';
import Table from '../Layouts/Table';
import { Eye } from 'lucide-react';
import { orderService } from '../../../services/orderService';
import toast from 'react-hot-toast';
import Modal from '../../ui/Modal';
import OrderDetailsView from '../../Publicwebsite/Order/OrderDetailsView';

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
      case 'delivered': return 'bg-emerald-100 text-emerald-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
        <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            className="bg-white border border-gray-300 text-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            return (
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedOrder(orderId)}
                  className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors"
                  title="View Details"
                >
                  <Eye size={18} />
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
    </div>
  );
}

export default Orders;
