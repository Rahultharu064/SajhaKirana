import React from 'react';
import type { Product } from '../../types/chatbottypes';
import { extractProductDetails, formatPrice, calculateDiscount } from '../../utils/chatbot.utils';
import { ShoppingCart, Image as ImageIcon, Sparkles, Star } from 'lucide-react';

interface ProductRecommendationProps {
    products: Product[];
    onAddToCart?: (productName: string) => void;
}

const ProductRecommendation: React.FC<ProductRecommendationProps> = ({ products, onAddToCart }) => {
    if (!products || products.length === 0) return null;

    return (
        <div className="flex flex-col gap-5 my-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 uppercase tracking-wider">
                    <Sparkles size={16} className="text-primary" />
                    Picked Just For You
                </h3>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full uppercase">
                    AI Curated
                </span>
            </div>

            <div className="flex gap-5 overflow-x-auto pb-6 -mx-2 px-2 scrollbar-hide">
                {products.map((product) => {
                    const details = extractProductDetails(product);
                    const discount = calculateDiscount(details.mrp || 0, details.price);

                    return (
                        <div
                            key={details.id}
                            className="flex-shrink-0 w-64 bg-white border border-gray-100 rounded-3xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className="aspect-square bg-gray-50 rounded-2xl mb-4 relative overflow-hidden shadow-inner group-hover:shadow-md transition-shadow">
                                {/* Product Image */}
                                {details.image ? (
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}/${details.image}`}
                                        alt={details.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-200">
                                        <ImageIcon size={48} strokeWidth={1.5} />
                                    </div>
                                )}

                                {discount > 0 && (
                                    <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full z-10 shadow-lg shadow-red-500/30">
                                        -{discount}%
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <span className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1 block">
                                    {details.category}
                                </span>
                                <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-primary transition-colors h-10">
                                    {details.name}
                                </h4>
                                {details.rating > 0 && (
                                    <div className="flex items-center gap-1 mt-1.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={10}
                                                className={i < Math.floor(details.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}
                                            />
                                        ))}
                                        <span className="text-[10px] font-bold text-gray-400 ml-1">{details.rating.toFixed(1)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-lg font-black text-gray-900">
                                        {formatPrice(details.price)}
                                    </span>
                                    {details.mrp && details.mrp > details.price && (
                                        <span className="text-xs text-gray-400 line-through font-medium">
                                            {formatPrice(details.mrp)}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => onAddToCart?.(`Add ${details.name} to my cart`)}
                                    className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 rounded-xl hover:bg-primary hover:text-white hover:rotate-12 transition-all duration-300 shadow-sm border border-gray-100 hover:border-primary active:scale-95"
                                    aria-label="Add to cart"
                                    title="Add to cart"
                                >
                                    <ShoppingCart size={18} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProductRecommendation;
