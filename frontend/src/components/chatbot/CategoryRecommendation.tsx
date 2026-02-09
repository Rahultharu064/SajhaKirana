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
        <div className="flex flex-col gap-3 my-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-black text-gray-400 flex items-center gap-1.5 uppercase tracking-[0.2em]">
                    <LayoutGrid size={12} className="text-primary" />
                    Popular Categories
                </h3>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        onClick={() => onSelect?.(`Show me items in ${category.name}`)}
                        className="flex-shrink-0 w-32 bg-white border border-gray-100 rounded-[1.5rem] p-3 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group text-center"
                    >
                        <div className="w-14 h-14 mx-auto bg-primary/5 rounded-2xl mb-2 flex items-center justify-center relative overflow-hidden group-hover:bg-primary/10 transition-colors">
                            {category.image ? (
                                <img
                                    src={`${import.meta.env.VITE_API_URL}/${category.image}`}
                                    alt={category.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <Sparkles size={18} className="text-primary/40" />
                            )}
                        </div>
                        <h4 className="text-[11px] font-bold text-gray-700 group-hover:text-primary transition-colors truncate">
                            {category.name}
                        </h4>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryRecommendation;
