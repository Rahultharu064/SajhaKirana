import React from 'react';
import type { Product } from '../../types/chatbottypes';
import { extractProductDetails, formatPrice, calculateDiscount } from '../../utils/chatbot.utils';

interface ProductRecommendationProps {
    products: Product[];
}

const ProductRecommendation: React.FC<ProductRecommendationProps> = ({ products }) => {
    if (!products || products.length === 0) return null;

    return (
        <div className="flex flex-col gap-4 my-4 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Recommended for you
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
                {products.map((product) => {
                    const details = extractProductDetails(product);
                    const discount = calculateDiscount(details.mrp || 0, details.price);

                    return (
                        <div
                            key={details.id}
                            className="flex-shrink-0 w-64 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 group"
                        >
                            <div className="aspect-square bg-gray-50 rounded-xl mb-3 relative overflow-hidden">
                                {/* Fallback pattern for images since we don't have the real image here */}
                                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.587-1.587a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                {discount > 0 && (
                                    <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10">
                                        -{discount}%
                                    </div>
                                )}
                            </div>
                            <div className="mb-2">
                                <span className="text-[10px] text-primary font-medium uppercase tracking-wide">
                                    {details.category}
                                </span>
                                <h4 className="text-sm font-semibold text-gray-800 line-clamp-1 group-hover:text-primary transition-colors">
                                    {details.name}
                                </h4>
                            </div>
                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex flex-col">
                                    <span className="text-base font-bold text-gray-900">
                                        {formatPrice(details.price)}
                                    </span>
                                    {details.mrp && details.mrp > details.price && (
                                        <span className="text-xs text-gray-400 line-through">
                                            {formatPrice(details.mrp)}
                                        </span>
                                    )}
                                </div>
                                <button
                                    className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-primary hover:text-white transition-all duration-300 shadow-sm overflow-hidden relative"
                                    aria-label="Add to cart"
                                    title="Add to cart"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
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
