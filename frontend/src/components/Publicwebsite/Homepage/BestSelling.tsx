import { useState, useEffect } from 'react';
import ProductCard from '../../ui/ProductCard';
import { getAllProducts } from '../../../services/productService';

interface Product {
  id: number;
  title: string;
  price: number;
  mrp: number;
  sku: string;
  images: string[];
}

const BestSelling = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Get popular products (using createdAt for now, can be updated for actual popularity)
        const response = await getAllProducts({ sort: 'priceHigh', limit: 5 });
        const productsData = response.data?.data || response.data;
        setProducts(productsData);
      } catch (error) {
        console.error('Failed to fetch bestselling products:', error);
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
        sku: product.sku,
        discount: product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0,
      };
    });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Best Selling</h2>
          <p className="text-lg text-gray-600">Most popular items among our customers</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-lg text-gray-600">Loading products...</div>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex space-x-6 pb-4 min-w-max">
              {mapProductsToCardFormat(products).map((product) => (
                <div key={`bestseller-${product.id}`} className="flex-shrink-0 w-72">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSelling;
