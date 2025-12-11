import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../ui/Button';
import { CheckCircle, ShoppingBag, MapPin, CreditCard, Clock, Package, Truck, Calendar, Printer, XCircle } from 'lucide-react';
import { orderService } from '../../../services/orderService';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { socket } from '../../../services/socket';

// Interfaces for state
interface OrderItem {
    id: number;
    sku: string;
    quantity: number;
    price: number;
    productId: number;
    product?: {
        title: string;
        images: string[];
    };
}

interface OrderDetails {
    id: number;
    total: number;
    orderStatus: string; // Changed from status to orderStatus
    paymentStatus: string;
    paymentMethod: string;
    createdAt: string;
    shippingAddress: string; // JSON string in DB, need to parse
    orderItems: OrderItem[];
}

interface OrderDetailsViewProps {
    orderId: string | number;
    isPaymentSuccess?: boolean;
}

const OrderDetailsView = ({ orderId, isPaymentSuccess = false }: OrderDetailsViewProps) => {
    const navigate = useNavigate();
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) return;
            try {
                const response = await orderService.getOrder(typeof orderId === 'string' ? parseInt(orderId) : orderId);
                // response.data could be the order directly or { success: true, data: order }
                if (response.data && response.data.success) {
                    setOrder(response.data.data);
                } else if (response.data) {
                    setOrder(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch order", error);
                toast.error("Could not load order details.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();

        // Socket listener for real-time updates
        const handleStatusUpdate = (data: any) => {
            console.log("Socket Event in DetailsView:", data, "Current ID:", orderId);
            if (data.orderId === (typeof orderId === 'string' ? parseInt(orderId) : orderId)) {
                // Update orderStatus
                setOrder(prev => prev ? { ...prev, orderStatus: data.status } : null);
                toast.success(`Order status updated to ${data.status}`);
            }
        };

        socket.on('orderStatusUpdated', handleStatusUpdate);

        return () => {
            socket.off('orderStatusUpdated', handleStatusUpdate);
        };
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h2>
                <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
                <Button onClick={() => navigate('/')}>Return to Home</Button>
            </div>
        );
    }

    // Parse Shipping Address
    let addressObj: any = {};
    try {
        addressObj = JSON.parse(order.shippingAddress);
    } catch (e) {
        addressObj = { address: order.shippingAddress }; // Fallback
    }

    // Calculate delivery date
    const deliveryDate = new Date(new Date(order.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric'
    });

    const baseSteps = [
        { status: 'pending', label: 'Order Placed', icon: Calendar },
        { status: 'processing', label: 'Processing', icon: Package },
        { status: 'shipped', label: 'Shipped', icon: Truck },
        { status: 'delivered', label: 'Delivered', icon: CheckCircle },
    ];

    const steps = (order.orderStatus || '').toLowerCase() === 'cancelled' ? [
        { status: 'pending', label: 'Order Placed', icon: Calendar },
        { status: 'cancelled', label: 'Cancelled', icon: XCircle }
    ] : baseSteps;

    // Safely calculate status index with fallback
    const currentStepIndex = steps.findIndex(s => s.status === (order.orderStatus || '').toLowerCase()) !== -1
        ? steps.findIndex(s => s.status === (order.orderStatus || '').toLowerCase())
        : 0;

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">

                {/* Header Section */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm"
                    >
                        <CheckCircle className="w-12 h-12 text-emerald-600" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl font-extrabold text-gray-900 mb-2"
                    >
                        {isPaymentSuccess ? "Payment Successful!" : "Order Confirmed!"}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg text-gray-600"
                    >
                        {isPaymentSuccess ? "Your transaction has been verified." : "Thank you for your purchase."}
                        Your order <span className="font-bold text-gray-900">#{order.id}</span> has been received.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content (Left 2/3) */}
                    <motion.div
                        className="lg:col-span-2 space-y-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >

                        {/* Order Status Timeline */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-emerald-600" />
                                Order Status
                            </h3>
                            <div className="relative flex justify-between">
                                {/* Connecting Line */}
                                <div className="absolute top-5 left-0 w-full h-1 bg-gray-100 -z-0 rounded-full"></div>
                                <div
                                    className="absolute top-5 left-0 h-1 bg-emerald-500 -z-0 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                                ></div>

                                {steps.map((step, index) => {
                                    const isCompleted = index <= currentStepIndex;
                                    const isCurrent = index === currentStepIndex;

                                    return (
                                        <div key={step.status} className="flex flex-col items-center z-10 relative">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors duration-300 ${isCompleted ? 'bg-emerald-600 border-white text-white' : 'bg-white border-gray-100 text-gray-300'}`}>
                                                <step.icon className="w-5 h-5" />
                                            </div>
                                            <span className={`mt-2 text-xs font-semibold uppercase tracking-wider ${isCurrent ? 'text-emerald-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="mt-8 bg-emerald-50 rounded-lg p-4 flex items-start gap-3">
                                <div className="bg-white p-2 rounded-full shadow-sm text-emerald-600">
                                    <Package className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-emerald-900">Estimated Delivery</p>
                                    <p className="text-sm text-emerald-700">Expected by {deliveryDate}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                                Order Items
                            </h3>
                            <div className="divide-y divide-gray-100">
                                {order.orderItems.map((item) => (
                                    <div key={item.id} className="py-4 flex gap-4 items-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                            {/* Placeholder for product image integration - can be replaced with item.product.images[0] if available */}
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                                                <ShoppingBag className="w-6 h-6" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{item.product?.title || item.sku}</h4>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity} × Rs. {item.price}</p>
                                        </div>
                                        <div className="font-bold text-gray-900">
                                            Rs. {item.price * item.quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </motion.div>

                    {/* Sidebar (Right 1/3) */}
                    <motion.div
                        className="lg:col-span-1 space-y-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        {/* Order Summary Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>
                            <div className="space-y-3 pb-6 border-b border-gray-100">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>Rs. {order.total}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-emerald-600 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Discount</span>
                                    <span>Rs. 0</span>
                                </div>
                            </div>
                            <div className="pt-4 flex justify-between items-center mb-6">
                                <span className="font-bold text-gray-900 text-lg">Total</span>
                                <span className="font-bold text-emerald-600 text-xl">Rs. {order.total}</span>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-gray-500 uppercase">Payment Method</span>
                                    {order.paymentMethod === 'esewa' && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">eSewa</span>}
                                    {order.paymentMethod === 'khalti' && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-bold">Khalti</span>}
                                    {order.paymentMethod === 'cod' && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-bold">COD</span>}
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <CreditCard className="w-4 h-4 text-gray-400" />
                                    <span className="font-medium capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Details Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-gray-500" />
                                Shipping To
                            </h3>
                            <div className="text-gray-600 space-y-1 text-sm">
                                <p className="font-bold text-gray-900 text-base mb-1">{addressObj.fullName}</p>
                                <p>{addressObj.address}, {addressObj.city}</p>
                                <p>{addressObj.district}</p>
                                {addressObj.landmark && <p className="text-gray-500 italic">Near {addressObj.landmark}</p>}
                                <p className="mt-3 text-gray-900">{addressObj.phone}</p>
                                <p className="text-gray-500">{addressObj.email}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            <Button
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                                size="lg"
                                onClick={() => navigate('/products')}
                            >
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                Continue Shopping
                            </Button>
                            <Button
                                className="w-full border-gray-200 hover:bg-gray-50 text-gray-700"
                                variant="outline"
                                onClick={() => window.print()}
                            >
                                <Printer className="w-4 h-4 mr-2" />
                                Print Receipt
                            </Button>
                        </div>

                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsView;
