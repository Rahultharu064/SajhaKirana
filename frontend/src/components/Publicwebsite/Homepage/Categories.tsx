import { useState, useEffect } from 'react';
import CategoryCard from '../../ui/CategoryCard';
import { getCategories } from '../../../services/categoryService';

interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
}

interface CategoriesProps {
  onCategorySelect: (category: Category) => void;
}

const Categories = ({ onCategorySelect }: CategoriesProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="py-16 bg-gray-50 text-center">Loading categories...</div>;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-lg text-gray-600">Browse our wide range of grocery categories</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={() => onCategorySelect(category)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
