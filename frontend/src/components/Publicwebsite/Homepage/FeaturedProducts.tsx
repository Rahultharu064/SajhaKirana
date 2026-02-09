import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../../ui/ProductCard';
import { getAllProducts } from '../../../services/productService';
import { Sparkles, ArrowRight, TrendingUp } from 'lucide-react';

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
        setProducts(productsData.slice(0, 4));
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
        discount: product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0,
        slug: product.slug,
      };
    });
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-emerald-100/40 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-teal-100/40 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200/50">
              <Sparkles size={16} className="text-emerald-600" />
              <span className="text-sm font-bold text-emerald-800">Top Quality Selection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900">
              Featured <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Products</span>
            </h2>
            <p className="text-slate-600 max-w-lg text-base sm:text-lg">
              Discover our handpicked selection of premium groceries, fresh from farm to your door.
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/products')}
            className="hidden lg:flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl group"
          >
            View All Products
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-emerald-100 rounded-full animate-spin"></div>
              <div className="w-16 h-16 border-4 border-transparent border-t-emerald-600 rounded-full animate-spin absolute top-0 left-0"></div>
              <Sparkles size={20} className="text-emerald-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mapProductsToCardFormat(products).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard
                    product={product as any}
                    onViewDetails={() => handleViewDetails(product.slug)}
                  />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-10 text-center lg:hidden"
            >
              <button
                onClick={() => navigate('/products')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/30 hover:shadow-xl transition-all"
              >
                View All Products
                <ArrowRight size={18} />
              </button>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
