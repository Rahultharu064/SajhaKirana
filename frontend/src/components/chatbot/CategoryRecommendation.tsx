import React from 'react';
import type { Category } from '../../types/chatbottypes';
import { LayoutGrid, Sparkles } from 'lucide-react';

interface CategoryRecommendationProps {
    categories: Category[];
    onSelect?: (categoryName: string) => void;
}

const CategoryRecommendation: React.FC<CategoryRecommendationProps> = ({ categories, onSelect }) => {
    if (!categories || categories.length === 0) return null;

    return (
        <div className="flex flex-col gap-5 my-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 uppercase tracking-wider">
                    <LayoutGrid size={16} className="text-primary" />
                    Browse Categories
                </h3>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full uppercase">
                    Quick Access
                </span>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-6 -mx-2 px-2 scrollbar-hide">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        onClick={() => onSelect?.(`Show me items in ${category.name}`)}
                        className="flex-shrink-0 w-40 bg-white border border-gray-100 rounded-[2rem] p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group text-center"
                    >
                        <div className="w-20 h-20 mx-auto bg-primary/5 rounded-full mb-4 flex items-center justify-center relative overflow-hidden group-hover:bg-primary/10 transition-colors">
                            {category.image ? (
                                <img
                                    src={`${import.meta.env.VITE_API_URL}/${category.image}`}
                                    alt={category.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <Sparkles size={24} className="text-primary/40" />
                            )}
                        </div>
                        <h4 className="text-xs font-bold text-gray-900 group-hover:text-primary transition-colors truncate">
                            {category.name}
                        </h4>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryRecommendation;
