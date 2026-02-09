import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { CartPreview as CartPreviewType } from '../../types/chatbottypes';
import { ShoppingBag, ArrowRight, Trash2, Sparkles } from 'lucide-react';
import { formatPrice } from '../../utils/chatbot.utils';

interface CartPreviewProps {
    cart: CartPreviewType;
    onClear?: () => void;
    onCheckout?: () => void;
}

const CartPreview: React.FC<CartPreviewProps> = ({ cart, onClear, onCheckout }) => {
    const navigate = useNavigate();

    if (!cart || cart.items.length === 0) return null;

    return (
        <div className="mt-5">
            <div className="bg-white border border-emerald-100 rounded-2xl overflow-hidden shadow-lg shadow-emerald-900/5">
                {/* Header */}
                <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-sm">
                            <ShoppingBag size={18} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-800">Your Cart</h3>
                            <p className="text-[10px] text-emerald-600 font-semibold">
                                {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'} added
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClear}
                        className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        title="Clear Cart"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                {/* Items */}
                <div className="max-h-[180px] overflow-y-auto divide-y divide-gray-50">
                    {cart.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/50 transition-colors">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                                {item.image ? (
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}/${item.image}`}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <ShoppingBag size={18} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[13px] font-semibold text-gray-800 truncate">
                                    {item.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[11px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-medium">
                                        Qty: {item.quantity}
                                    </span>
                                    <span className="text-[12px] font-bold text-emerald-600">
                                        {formatPrice(item.price * item.quantity)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-4 py-4 bg-gradient-to-r from-emerald-600 to-teal-600">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Sparkles size={14} className="text-emerald-200" />
                            <span className="text-[11px] text-emerald-200 font-semibold uppercase tracking-wide">Total</span>
                        </div>
                        <span className="text-xl font-bold text-white">{formatPrice(cart.total)}</span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate('/cart')}
                            className="flex-1 py-2.5 text-[13px] font-semibold text-white bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-colors"
                        >
                            View Cart
                        </button>
                        <button
                            onClick={onCheckout}
                            className="flex-1 py-2.5 text-[13px] font-bold text-emerald-700 bg-white rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-center gap-1.5 shadow-lg"
                        >
                            Checkout
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPreview;
