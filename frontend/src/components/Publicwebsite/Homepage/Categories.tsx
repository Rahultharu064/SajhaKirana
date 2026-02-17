import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Apple, Milk, Wheat, Carrot, Coffee, Sandwich, ShoppingBag, ArrowRight, Grid3X3 } from 'lucide-react';
import { getCategories } from '../../../services/categoryService';
import type { Category as CategoryType } from '../../../services/categoryService';

interface Category extends CategoryType {
  icon?: any;
  color?: string;
  bgLight?: string;
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
      { color: 'rose', bgLight: 'bg-rose-50' },
      { color: 'blue', bgLight: 'bg-blue-50' },
      { color: 'amber', bgLight: 'bg-amber-50' },
      { color: 'emerald', bgLight: 'bg-emerald-50' },
      { color: 'violet', bgLight: 'bg-violet-50' },
      { color: 'pink', bgLight: 'bg-pink-50' },
      { color: 'indigo', bgLight: 'bg-indigo-50' },
      { color: 'lime', bgLight: 'bg-lime-50' },
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
      <section className="py-20 bg-slate-50 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-50 rounded-full blur-3xl opacity-50"></div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200">
            <Grid3X3 size={16} className="text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">Shop by Category</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900">
            Explore <span className="text-emerald-600">Categories</span>
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
              <div className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-lg transition-all duration-300 h-full flex flex-col items-center text-center gap-4">
                {/* Icon */}
                <div className={`bg-${category.color}-100 p-4 rounded-xl`}>
                  {category.icon && <category.icon className={`w-7 h-7 text-${category.color}-600`} />}
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
