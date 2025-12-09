import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Publicwebsite/Layouts/Header';
import Footer from '../../components/Publicwebsite/Layouts/Footer';
import ProductCard from '../../components/ui/ProductCard';
import { getCategories } from '../../services/categoryService';
import { getProductsByCategory } from '../../services/productService';

interface Product {
  id: number;
  title: string;
  price: number;
  mrp: number;
  images: string[];
}

const CategoryProducts = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>('');

  useEffect(() => {
    const fetchProducts = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const response = await getProductsByCategory(parseInt(id), { limit: 50 });
        const productsData = response.data?.data || response.data;
        setProducts(productsData);
      } catch (err) {
        console.error('Failed to fetch category products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    const fetchCategoryName = async () => {
      try {
        const categories = await getCategories();
        const category = categories.find((cat: any) => cat.id === parseInt(id || ''));
        if (category) {
          setCategoryName(category.name);
        }
      } catch (err) {
        console.error('Failed to fetch category name:', err);
      }
    };

    fetchProducts();
    fetchCategoryName();
  }, [id]);

  // Map backend product data to ProductCard format
  const mapProductsToCardFormat = (products: Product[]) => {
    return products.map(product => {
      // Handle image URLs - use relative path for proxy
      let imageUrl = '/api/placeholder/300/200';
      if (product.images && product.images.length > 0) {
        imageUrl = product.images[0]; // Backend returns full paths like /uploads/products/filename.jpg
      }
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        mrp: product.mrp,
        rating: 4.5, // Default rating
        image: imageUrl,
        discount: product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0,
      };
    });
  };

  const handleViewDetails = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {categoryName ? `${categoryName} Products` : 'Category Products'}
            </h2>
            <p className="text-lg text-gray-600">
              Browse through our complete collection
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-lg text-gray-600">Loading products...</div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-600">{error}</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mapProductsToCardFormat(products).map((product) => (
                <ProductCard key={product.id} product={product} onViewDetails={handleViewDetails} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600">No products available in this category</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CategoryProducts;
