import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Apple, Milk, Wheat, Carrot, Coffee, Sandwich, ShoppingBag, ArrowRight, Grid3X3, Sparkles } from 'lucide-react';
import { getCategories } from '../../../services/categoryService';
import type { Category as CategoryType } from '../../../services/categoryService';

interface Category extends CategoryType {
  icon?: any;
  colorClass?: string;
  iconBg?: string;
}

interface CategoriesProps {
  onCategorySelect: (category: any) => void;
}

const Categories = ({ onCategorySelect }: CategoriesProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const getCategoryTheme = (slug: string, index: number) => {
    const icon = (() => {
      if (slug.includes('fruit') || slug.includes('veg')) return Apple;
      if (slug.includes('dairy') || slug.includes('egg')) return Milk;
      if (slug.includes('baker') || slug.includes('bread')) return Sandwich;
      if (slug.includes('grain') || slug.includes('rice')) return Wheat;
      if (slug.includes('snack')) return Carrot;
      if (slug.includes('bev') || slug.includes('drink')) return Coffee;
      return ShoppingBag;
    })();

    const themes = [
      { colorClass: 'text-rose-600', iconBg: 'bg-rose-100' },
      { colorClass: 'text-blue-600', iconBg: 'bg-blue-100' },
      { colorClass: 'text-amber-600', iconBg: 'bg-amber-100' },
      { colorClass: 'text-emerald-600', iconBg: 'bg-emerald-100' },
      { colorClass: 'text-violet-600', iconBg: 'bg-violet-100' },
      { colorClass: 'text-sky-600', iconBg: 'bg-sky-100' },
    ];

    return { icon, ...themes[index % themes.length] };
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        const processed = data.map((cat, idx) => ({
          ...cat,
          ...getCategoryTheme(cat.slug, idx)
        }));
        setCategories(processed);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return null;

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-50 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-50 rounded-full blur-[100px] -z-10" />

      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-[2px] w-8 bg-emerald-500" />
            <span className="text-emerald-600 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2">
              <Sparkles size={14} /> Shop by Category
            </span>
            <div className="h-[2px] w-8 bg-emerald-500" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6">
            Freshness in <span className="text-gradient">Every Aisle</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto font-medium">
            Discover our curated selection of premium groceries, from organic farms to your kitchen.
          </p>
        </motion.div>

        <div className="grid-categories">
          {categories.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onCategorySelect(category)}
              className="group cursor-pointer"
            >
              <div className="glass-card rounded-[2.5rem] p-8 h-full flex flex-col items-center text-center gap-6">
                <div className={`${category.iconBg} p-5 rounded-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm`}>
                  {category.icon && <category.icon className={`w-8 h-8 ${category.colorClass}`} />}
                </div>

                <div className="space-y-2">
                  <h3 className="font-black text-slate-800 text-sm tracking-tight group-hover:text-emerald-600 transition-colors">
                    {category.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-black text-emerald-500 opacity-0 group-hover:opacity-100 transition-all -translate-y-2 group-hover:translate-y-0 uppercase tracking-widest">
                    <span>Shop</span>
                    <ArrowRight size={10} />
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
