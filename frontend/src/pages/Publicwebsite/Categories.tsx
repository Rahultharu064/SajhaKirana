import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Publicwebsite/Layouts/Header';
import Footer from '../../components/Publicwebsite/Layouts/Footer';
import CategoryCard from '../../components/ui/CategoryCard';
import { getCategories } from '../../services/categoryService';
import { ChevronRight } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
    image?: string;
}

const Categories = () => {
    const navigate = useNavigate();
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

    const handleCategorySelect = (category: Category) => {
        navigate(`/category/${category.id}`);
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <div className="container mx-auto px-4 py-6 md:py-10">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
                    <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
                    <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-900 font-medium">Categories</span>
                </nav>

                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">All Categories</h1>
                    <p className="text-lg text-gray-600">Explore our wide range of products by category</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                        {categories.map((category) => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                onClick={() => handleCategorySelect(category)}
                            />
                        ))}
                    </div>
                )}

                {!loading && categories.length === 0 && (
                    <div className="text-center py-16 bg-gray-50 rounded-2xl">
                        <p className="text-gray-500 text-lg">No categories found.</p>
                    </div>
                )}

            </div>

            <Footer />
        </div>
    );
};

export default Categories;
