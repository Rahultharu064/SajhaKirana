import React from 'react';
import type { Product } from '../../types/chatbottypes';
import { extractProductDetails, formatPrice, calculateDiscount } from '../../utils/chatbot.utils';
import { Plus, ImageIcon, Star, TrendingUp } from 'lucide-react';

interface ProductRecommendationProps {
    products: Product[];
    onAddToCart?: (productName: string) => void;
}

const ProductRecommendation: React.FC<ProductRecommendationProps> = ({ products, onAddToCart }) => {
    if (!products || products.length === 0) return null;

    return (
        <div className="mt-5">
            {/* Section Header */}
            <div className="flex items-center gap-2 mb-4 px-1">
                <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                    <TrendingUp size={12} className="text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-800">Recommended for You</h3>
            </div>

            {/* Product Cards */}
            <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
                {products.map((product) => {
                    const details = extractProductDetails(product);
                    const discount = calculateDiscount(details.mrp || 0, details.price);

                    return (
                        <div
                            key={details.id}
                            className="flex-shrink-0 w-48 bg-white border border-gray-100 rounded-2xl p-3 hover:shadow-lg hover:border-emerald-200 transition-all duration-300 group"
                        >
                            {/* Image */}
                            <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl mb-3 relative overflow-hidden">
                                {details.image ? (
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}/${details.image}`}
                                        alt={details.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                        <ImageIcon size={28} strokeWidth={1.5} />
                                    </div>
                                )}

                                {discount > 0 && (
                                    <div className="absolute top-2 left-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                        -{discount}%
                                    </div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="mb-3">
                                <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wide mb-0.5">
                                    {details.category}
                                </p>
                                <h4 className="text-[13px] font-semibold text-gray-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                                    {details.name}
                                </h4>
                                {details.rating > 0 && (
                                    <div className="flex items-center gap-1 mt-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={10}
                                                className={i < Math.floor(details.rating)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-200"}
                                            />
                                        ))}
                                        <span className="text-[10px] text-gray-400 font-medium ml-0.5">
                                            ({details.rating.toFixed(1)})
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Price & Action */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-base font-bold text-gray-900">
                                        {formatPrice(details.price)}
                                    </span>
                                    {details.mrp && details.mrp > details.price && (
                                        <span className="text-[11px] text-gray-400 line-through ml-1.5">
                                            {formatPrice(details.mrp)}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => onAddToCart?.(`Add ${details.name} to my cart`)}
                                    className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 shadow-sm"
                                    aria-label="Add to cart"
                                >
                                    <Plus size={16} />
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
