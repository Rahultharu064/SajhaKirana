import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Apple, Milk, Wheat, Carrot, Coffee, Sandwich, ShoppingBag } from 'lucide-react';
import { getCategories } from '../../../services/categoryService';
import type { Category as CategoryType } from '../../../services/categoryService';

interface Category extends CategoryType {
  icon?: any;
  color?: string;
}

interface CategoriesProps {
  onCategorySelect: (category: any) => void;
}

const Categories = ({ onCategorySelect }: CategoriesProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const getCategoryIcon = (slug: string) => {
    if (slug.includes('fruit') || slug.includes('veg')) return Apple;
    if (slug.includes('dairy') || slug.includes('egg')) return Milk;
    if (slug.includes('baker') || slug.includes('bread')) return Sandwich;
    if (slug.includes('grain') || slug.includes('rice')) return Wheat;
    if (slug.includes('snack')) return Carrot;
    if (slug.includes('bev') || slug.includes('drink')) return Coffee;
    return ShoppingBag;
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      'bg-red-50 text-red-600',
      'bg-blue-50 text-blue-600',
      'bg-amber-50 text-amber-600',
      'bg-yellow-50 text-yellow-600',
      'bg-orange-50 text-orange-600',
      'bg-purple-50 text-purple-600',
      'bg-emerald-50 text-emerald-600',
      'bg-pink-50 text-pink-600',
    ];
    return colors[index % colors.length];
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        // Map backend data to include UI specific props
        const processedCategories = data.map((cat, index) => ({
          ...cat,
          icon: getCategoryIcon(cat.slug),
          color: getCategoryColor(index)
        }));
        setCategories(processedCategories);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="section-padding bg-slate-50 flex justify-center items-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-emerald-200"></div>
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-emerald-600 absolute top-0 left-0"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-slate-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-tr from-cyan-100/30 to-transparent rounded-full blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-12 sm:mb-16 space-y-3 px-4 sm:px-0">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-100 to-emerald-100 border border-cyan-200/50">
            <div className="w-2 h-2 bg-cyan-600 rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm font-semibold text-cyan-800">Shop by Category</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">Explore Categories</h2>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto">Browse through our wide range of fresh products</p>
        </div>

        <div className="grid-responsive-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => onCategorySelect(category)}
              className="card-modern group cursor-pointer hover:shadow-xl transition-all duration-300 p-4 sm:p-6"
            >
              <div className="flex flex-col items-center text-center gap-3 sm:gap-4">
                <div className={`relative p-3 sm:p-4 rounded-2xl ${category.color} group-hover:scale-110 transition-transform`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-2xl"></div>
                  {category.icon && <category.icon className="w-6 h-6 sm:w-8 sm:h-8 relative z-10" />}
                </div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-emerald-600 transition-colors line-clamp-2">
                  {category.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
