import { useState, useEffect } from 'react';
import ProductCard from '../../ui/ProductCard';
import { getAllProducts } from '../../../services/productService';

interface Product {
  id: number;
  title: string;
  price: number;
  mrp: number;
  images: string[];
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Map backend product data to ProductCard format
  const mapProductsToCardFormat = (products: Product[]) => {
    return products.map(product => {
      // Use relative path for images - Vite proxy will handle routing to backend
      let imageUrl = '/api/placeholder/300/200';
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
        discount: product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0,
      };
    });
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-lg text-gray-600">Discover our handpicked selection of premium groceries</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-lg text-gray-600">Loading products...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mapProductsToCardFormat(products).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
