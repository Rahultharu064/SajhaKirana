// frontend/src/components/chatbot/OrderStatusCard.tsx
// Order status display card for chatbot responses

import React from 'react';
import { Package, Truck, CheckCircle2, XCircle, Clock, MapPin, CreditCard, ChevronRight } from 'lucide-react';
import type { OrderStatus } from '../../services/customerServiceService';

interface OrderStatusCardProps {
    order: OrderStatus;
    onViewDetails?: () => void;
    onCancelOrder?: () => void;
}

const OrderStatusCard: React.FC<OrderStatusCardProps> = ({
    order,
    onViewDetails,
    onCancelOrder
}) => {
    // Status configuration
    const statusConfig: Record<string, { icon: React.ReactNode; color: string; bgColor: string }> = {
        pending: {
            icon: <Clock size={20} />,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50 border-yellow-200'
        },
        confirmed: {
            icon: <CheckCircle2 size={20} />,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 border-blue-200'
        },
        processing: {
            icon: <Package size={20} />,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50 border-purple-200'
        },
        shipped: {
            icon: <Truck size={20} />,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50 border-orange-200'
        },
        delivered: {
            icon: <CheckCircle2 size={20} />,
            color: 'text-green-600',
            bgColor: 'bg-green-50 border-green-200'
        },
        cancelled: {
            icon: <XCircle size={20} />,
            color: 'text-red-600',
            bgColor: 'bg-red-50 border-red-200'
        }
    };

    const config = statusConfig[order.status] || statusConfig.pending;

    // Progress steps
    const progressSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentStep = progressSteps.indexOf(order.status);

    return (
        <div className={`rounded-2xl border ${config.bgColor} overflow-hidden animate-in slide-in-from-left-2 duration-300`}>
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 bg-white/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${config.bgColor} ${config.color}`}>
                            {config.icon}
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">Order #{order.id}</h4>
                            <p className={`text-sm font-medium ${config.color}`}>
                                {order.statusMessage}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-gray-800">Rs {order.total.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{order.itemCount} items</p>
                    </div>
                </div>
            </div>

            {/* Progress Bar (only for active orders) */}
            {order.status !== 'cancelled' && (
                <div className="px-5 py-3 bg-white/30">
                    <div className="flex items-center gap-1">
                        {progressSteps.map((step, index) => (
                            <React.Fragment key={step}>
                                <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${index <= currentStep
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-200 text-gray-400'
                                        }`}
                                >
                                    {index < currentStep ? '✓' : index + 1}
                                </div>
                                {index < progressSteps.length - 1 && (
                                    <div
                                        className={`flex-1 h-1 rounded-full transition-all ${index < currentStep ? 'bg-primary' : 'bg-gray-200'
                                            }`}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="flex justify-between mt-1 text-[10px] text-gray-500">
                        <span>Placed</span>
                        <span>Confirmed</span>
                        <span>Packing</span>
                        <span>Shipped</span>
                        <span>Delivered</span>
                    </div>
                </div>
            )}

            {/* Items Preview */}
            <div className="px-5 py-3 bg-white/50">
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {order.items.slice(0, 4).map((item) => (
                        <div
                            key={item.id}
                            className="flex-shrink-0 flex items-center gap-2 bg-white rounded-xl p-2 pr-4 border border-gray-100 shadow-sm"
                        >
                            {item.image ? (
                                <img
                                    src={item.image.startsWith('http') ? item.image : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003'}/${item.image.replace(/^\//, '')}`}
                                    alt={item.name}
                                    className="w-10 h-10 rounded-lg object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=No+Image';
                                        (e.target as HTMLImageElement).onerror = null;
                                    }}
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <Package size={16} className="text-gray-400" />
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-gray-700 truncate max-w-[100px]">
                                    {item.name}
                                </p>
                                <p className="text-[10px] text-gray-500">x{item.quantity}</p>
                            </div>
                        </div>
                    ))}
                    {order.items.length > 4 && (
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">
                            +{order.items.length - 4}
                        </div>
                    )}
                </div>
            </div>

            {/* Info Row */}
            <div className="px-5 py-3 bg-white/30 flex flex-wrap gap-4 text-xs">
                {order.estimatedDelivery && (
                    <div className="flex items-center gap-1.5 text-gray-600">
                        <Truck size={14} className="text-primary" />
                        <span>Est. {order.estimatedDelivery}</span>
                    </div>
                )}
                <div className="flex items-center gap-1.5 text-gray-600">
                    <CreditCard size={14} className="text-primary" />
                    <span className="capitalize">{order.paymentMethod}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${order.paymentStatus === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {order.paymentStatus}
                    </span>
                </div>
                {order.shippingAddress?.city && (
                    <div className="flex items-center gap-1.5 text-gray-600">
                        <MapPin size={14} className="text-primary" />
                        <span>{order.shippingAddress.city}</span>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="px-5 py-3 bg-white border-t border-gray-100 flex gap-2">
                <button
                    onClick={onViewDetails}
                    className="flex-1 py-2 rounded-xl bg-primary text-white font-medium text-sm flex items-center justify-center gap-1 hover:bg-primary-dark transition-colors"
                >
                    View Details
                    <ChevronRight size={16} />
                </button>
                {order.canCancel && (
                    <button
                        onClick={onCancelOrder}
                        className="px-4 py-2 rounded-xl border border-red-200 text-red-600 font-medium text-sm hover:bg-red-50 transition-colors"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
};

export default OrderStatusCard;
