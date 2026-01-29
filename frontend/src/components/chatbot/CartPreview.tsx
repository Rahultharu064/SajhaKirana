import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { CartPreview as CartPreviewType } from '../../types/chatbottypes';
import { ShoppingBasket, ArrowRight, Trash2, Eye } from 'lucide-react';
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
        <div className="my-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-xl shadow-gray-200/50">
                {/* Header */}
                <div className="px-8 py-5 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <ShoppingBasket size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">Your Basket</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                                {cart.itemCount} Items
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClear}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group"
                        title="Clear Cart"
                    >
                        <Trash2 size={18} className="group-hover:rotate-12 transition-transform" />
                    </button>
                </div>

                {/* Items List */}
                <div className="max-h-[240px] overflow-y-auto px-6 py-2 scrollbar-hide">
                    {cart.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0 group">
                            <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 group-hover:shadow-sm transition-shadow">
                                {item.image ? (
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}/${item.image}`}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100/50">
                                        <ShoppingBasket size={20} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-gray-800 truncate group-hover:text-primary transition-colors">
                                    {item.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md">
                                        Qty: {item.quantity}
                                    </span>
                                    <span className="text-xs font-black text-gray-900">
                                        {formatPrice(item.price * item.quantity)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer / Total */}
                <div className="px-8 py-6 bg-primary text-white">
                    <div className="flex items-center justify-between mb-5">
                        <span className="text-xs font-bold text-white/70 uppercase tracking-widest">Grand Total</span>
                        <span className="text-xl font-black">{formatPrice(cart.total)}</span>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => navigate('/cart')}
                            className="w-full py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 border border-white/20"
                        >
                            <Eye size={18} />
                            View Full Cart
                        </button>

                        <button
                            onClick={onCheckout}
                            className="w-full py-4 bg-white text-primary rounded-2xl font-bold text-sm shadow-xl shadow-black/10 hover:bg-gray-50 hover:-translate-y-0.5 transition-all active:translate-y-0 flex items-center justify-center gap-2 group"
                        >
                            Checkout Now
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPreview;
