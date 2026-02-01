import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../ui/ProductCard';
import { getAllProducts } from '../../../services/productService';

interface Product {
  id: number;
  title: string;
  price: number;
  mrp: number;
  sku: string;
  images: string[];
  slug: string;
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts({ limit: 8 });
        const productsData = response.data?.data || response.data;
        setProducts(productsData.slice(0, 4)); // Take first 4 products
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleViewDetails = (slug: string) => {
    navigate(`/product/${slug}`);
  };

  // Map backend product data to ProductCard format
  const mapProductsToCardFormat = (products: Product[]) => {
    return products.map(product => {
      // Use relative path for images - Vite proxy will handle routing to backend
      let imageUrl = 'https://placehold.co/300x200?text=Product';
      if (product.images && product.images.length > 0) {
        imageUrl = product.images[0]; // Backend returns full paths like /uploads/products/filename.jpg
      }
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        mrp: product.mrp,
        rating: 4.5, // Default rating (can be fetched from reviews later)
        image: imageUrl,
        sku: product.sku,
        discount: product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0,
        slug: product.slug,
      };
    });
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="text-center md:text-left">
            <span className="text-emerald-600 font-semibold tracking-wider uppercase text-sm">Top Quality</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Featured Products</h2>
            <p className="text-lg text-gray-600 mt-2 max-w-xl">Discover our handpicked selection of premium groceries available for instant delivery.</p>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="hidden md:flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700 transition-colors group"
          >
            View All Products
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {mapProductsToCardFormat(products).map((product, index) => (
              <div key={product.id} className="opacity-0 animate-fadeIn" style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}>
                <ProductCard
                  product={product as any}
                  onViewDetails={() => handleViewDetails(product.slug)}
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 font-bold px-6 py-3 rounded-full hover:bg-emerald-100 transition-colors"
          >
            View All Products
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
