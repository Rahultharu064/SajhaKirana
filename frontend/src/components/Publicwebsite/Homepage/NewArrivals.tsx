import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../../ui/ProductCard';
import { getAllProducts } from '../../../services/productService';
import { Sparkles, Zap, Clock } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  price: number;
  mrp: number;
  sku: string;
  slug: string;
  images: string[];
}

const NewArrivals = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts({ sort: 'newest', limit: 4 });
        const productsData = response.data?.data || response.data;
        setProducts(productsData);
      } catch (error) {
        console.error('Failed to fetch new arrivals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleViewDetails = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product?.slug) {
      navigate(`/product/${product.slug}`);
    } else {
      navigate(`/product/${productId}`);
    }
  };

  const mapProductsToCardFormat = (products: Product[]) => {
    return products.map(product => {
      let imageUrl = 'https://placehold.co/300x200?text=Product';
      if (product.images && product.images.length > 0) {
        imageUrl = product.images[0];
      }
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        mrp: product.mrp,
        rating: 4.5,
        image: imageUrl,
        sku: product.sku,
        slug: product.slug,
        discount: product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0,
      };
    });
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-amber-50/30 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-amber-200/30 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-orange-200/30 to-transparent rounded-full blur-3xl"></div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200/50">
            <Zap size={16} className="text-amber-600 fill-current" />
            <span className="text-sm font-bold text-amber-800">Just Arrived</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900">
            New <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Arrivals</span>
          </h2>
          <p className="text-slate-600 max-w-lg mx-auto text-base sm:text-lg">
            Fresh products just arrived in our store - be the first to try!
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-amber-100 rounded-full animate-spin"></div>
              <div className="w-16 h-16 border-4 border-transparent border-t-amber-600 rounded-full animate-spin absolute top-0 left-0"></div>
              <Clock size={20} className="text-amber-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mapProductsToCardFormat(products).map((product, index) => (
              <motion.div
                key={`new-${product.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative">
                  <div className="absolute -top-3 left-4 z-10 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                    <Sparkles size={12} />
                    New
                  </div>
                  <ProductCard
                    product={product}
                    onViewDetails={handleViewDetails}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewArrivals;
