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
      <section className="py-20 bg-gray-50 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-emerald-600 font-semibold tracking-wider uppercase text-sm">Shop by Category</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Explore Categories</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => onCategorySelect(category)}
              className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all cursor-pointer group border border-gray-100"
            >
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transition-colors ${category.color}`}>
                {category.icon && <category.icon className="w-8 h-8" />}
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                {category.name}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
