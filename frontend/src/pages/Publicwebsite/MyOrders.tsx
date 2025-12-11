import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Package, Calendar, ChevronRight, ShoppingBag, Clock } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import { orderService } from '../../services/orderService';
import type { RootState } from '../../Redux/store';
import toast from 'react-hot-toast';
import { socket } from '../../services/socket';

interface OrderSummary {
    id: number;
    total: number;
    orderStatus: string; // Changed to orderStatus
    paymentStatus: string;
    createdAt: string;
    itemCount: number;
}

const MyOrders = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login?redirect=/my-orders');
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await orderService.getUserOrders(user.userId);
                if (response.data && response.data.success) {
                    setOrders(response.data.data);
                } else if (Array.isArray(response.data)) {
                    // Handle potential direct array response
                    setOrders(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch orders", error);
                toast.error("Could not load your orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();

        const handleStatusUpdate = (data: any) => {
            console.log("Socket Event in MyOrders:", data);
            setOrders(prevOrders => prevOrders.map(order =>
                order.id === data.orderId
                    ? { ...order, orderStatus: data.status, paymentStatus: data.updatedOrder?.paymentStatus || order.paymentStatus }
                    : order
            ));
        };

        socket.on('orderStatusUpdated', handleStatusUpdate);

        return () => {
            socket.off('orderStatusUpdated', handleStatusUpdate);
        };
    }, [user, navigate]);

    const getStatusColor = (status: string | undefined | null) => {
        if (!status) return 'bg-gray-100 text-gray-700';
        switch (status.toLowerCase()) {
            case 'delivered': return 'bg-emerald-100 text-emerald-700';
            case 'shipped': return 'bg-blue-100 text-blue-700';
            case 'processing': return 'bg-yellow-100 text-yellow-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Package className="w-8 h-8 text-emerald-600" />
                            My Orders
                        </h1>
                        <Button variant="outline" onClick={() => navigate('/products')}>
                            Continue Shopping
                        </Button>
                    </div>

                    {orders.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center"
                        >
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShoppingBag className="w-10 h-10 text-gray-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
                            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                                Looks like you haven't placed an order yet. Start shopping to find amazing products!
                            </p>
                            <Button onClick={() => navigate('/products')} size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                Start Shopping
                            </Button>
                        </motion.div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order, index) => (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer group"
                                    onClick={() => navigate(`/order/confirmation/${order.id}`)}
                                >
                                    <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between sm:justify-start gap-4 mb-2">
                                                <span className="text-lg font-bold text-gray-900">#{order.id}</span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusColor(order.orderStatus)}`}>
                                                    {order.orderStatus || 'Pending'}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-medium text-gray-900">Rs. {order.total}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-4 sm:pt-0">
                                            <div className="text-sm text-right hidden sm:block">
                                                <p className="font-medium text-emerald-600">View Details</p>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                                        </div>
                                    </div>
                                    <div className="h-1 bg-emerald-600 w-0 group-hover:w-full transition-all duration-300"></div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default MyOrders;
