import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Apple, Milk, Wheat, Carrot, Coffee, Sandwich, ShoppingBag, ArrowRight, Grid3X3 } from 'lucide-react';
import { getCategories } from '../../../services/categoryService';
import type { Category as CategoryType } from '../../../services/categoryService';

interface Category extends CategoryType {
  icon?: any;
  gradient?: string;
  shadowColor?: string;
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

  const getCategoryStyle = (index: number) => {
    const styles = [
      { gradient: 'from-rose-500 to-pink-500', shadowColor: 'shadow-rose-500/30', bgLight: 'bg-rose-50' },
      { gradient: 'from-blue-500 to-cyan-500', shadowColor: 'shadow-blue-500/30', bgLight: 'bg-blue-50' },
      { gradient: 'from-amber-500 to-orange-500', shadowColor: 'shadow-amber-500/30', bgLight: 'bg-amber-50' },
      { gradient: 'from-emerald-500 to-teal-500', shadowColor: 'shadow-emerald-500/30', bgLight: 'bg-emerald-50' },
      { gradient: 'from-violet-500 to-purple-500', shadowColor: 'shadow-violet-500/30', bgLight: 'bg-violet-50' },
      { gradient: 'from-fuchsia-500 to-pink-500', shadowColor: 'shadow-fuchsia-500/30', bgLight: 'bg-fuchsia-50' },
      { gradient: 'from-indigo-500 to-blue-500', shadowColor: 'shadow-indigo-500/30', bgLight: 'bg-indigo-50' },
      { gradient: 'from-lime-500 to-green-500', shadowColor: 'shadow-lime-500/30', bgLight: 'bg-lime-50' },
    ];
    return styles[index % styles.length];
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        const processedCategories = data.map((cat, index) => ({
          ...cat,
          icon: getCategoryIcon(cat.slug),
          ...getCategoryStyle(index)
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
      <section className="py-20 bg-gradient-to-b from-slate-50 to-cyan-50/30 flex justify-center items-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyan-100 rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-4 border-transparent border-t-cyan-600 rounded-full animate-spin absolute top-0 left-0"></div>
          <Grid3X3 size={20} className="text-cyan-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-cyan-200/30 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-emerald-200/30 to-transparent rounded-full blur-3xl"></div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-100 to-emerald-100 border border-cyan-200/50">
            <Grid3X3 size={16} className="text-cyan-600" />
            <span className="text-sm font-bold text-cyan-800">Shop by Category</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900">
            Explore <span className="bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">Categories</span>
          </h2>
          <p className="text-slate-600 max-w-lg mx-auto text-base sm:text-lg">
            Browse through our wide range of fresh products and find what you need
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => onCategorySelect(category)}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-3xl p-5 border border-slate-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 h-full flex flex-col items-center text-center gap-4">
                {/* Icon */}
                <div className={`relative`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity`}></div>
                  <div className={`relative bg-gradient-to-br ${category.gradient} p-4 rounded-2xl shadow-lg ${category.shadowColor}`}>
                    {category.icon && <category.icon className="w-7 h-7 text-white" />}
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {category.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1 text-xs text-slate-400 group-hover:text-emerald-500 transition-colors opacity-0 group-hover:opacity-100">
                    <span>Explore</span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
