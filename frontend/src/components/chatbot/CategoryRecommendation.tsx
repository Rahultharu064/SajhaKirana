import React from 'react';
import type { Category } from '../../types/chatbottypes';
import { Layers, ChevronRight } from 'lucide-react';

interface CategoryRecommendationProps {
    categories: Category[];
    onSelect?: (categoryName: string) => void;
}

const CategoryRecommendation: React.FC<CategoryRecommendationProps> = ({ categories, onSelect }) => {
    if (!categories || categories.length === 0) return null;

    // Gradient colors for category icons
    const gradients = [
        'from-violet-400 to-purple-500',
        'from-pink-400 to-rose-500',
        'from-amber-400 to-orange-500',
        'from-cyan-400 to-blue-500',
        'from-emerald-400 to-teal-500',
        'from-fuchsia-400 to-pink-500',
    ];

    return (
        <div className="mt-5">
            {/* Section Header */}
            <div className="flex items-center gap-2 mb-4 px-1">
                <div className="w-6 h-6 bg-gradient-to-br from-violet-400 to-purple-500 rounded-lg flex items-center justify-center shadow-sm">
                    <Layers size={12} className="text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-800">Browse Categories</h3>
            </div>

            {/* Category Chips */}
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((category, index) => (
                    <div
                        key={category.id}
                        onClick={() => onSelect?.(`Show me items in ${category.name}`)}
                        className="flex-shrink-0 bg-white border border-gray-100 rounded-2xl px-4 py-3 hover:shadow-md hover:border-emerald-200 transition-all duration-200 cursor-pointer flex items-center gap-3 group"
                    >
                        <div className={`w-10 h-10 bg-gradient-to-br ${gradients[index % gradients.length]} rounded-xl flex items-center justify-center overflow-hidden shadow-sm`}>
                            {category.image ? (
                                <img
                                    src={`${import.meta.env.VITE_API_URL}/${category.image}`}
                                    alt={category.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-white font-bold text-sm">
                                    {category.name.charAt(0)}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-700 group-hover:text-emerald-600 transition-colors whitespace-nowrap">
                                {category.name}
                            </span>
                            <ChevronRight size={14} className="text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryRecommendation;
