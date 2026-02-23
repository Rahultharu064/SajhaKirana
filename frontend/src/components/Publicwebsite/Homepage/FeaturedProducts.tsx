import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../../ui/ProductCard';
import { getAllProducts } from '../../../services/productService';
import { Sparkles, ArrowRight } from 'lucide-react';

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
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-[120px] -z-10" />

      <div className="container-custom relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4 max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-widest">
              <Sparkles size={14} className="animate-pulse" />
              <span>Premium Selects</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
              Farm-To-Table <br className="hidden sm:block" />
              <span className="text-gradient">Featured Freshness</span>
            </h2>
            <p className="text-slate-500 text-lg font-medium">
              Hand-picked daily essentials from local organic farmers, quality tested for your family.
            </p>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/products')}
            className="btn-premium px-8 py-4 flex items-center gap-3 hidden lg:flex"
          >
            <span className="text-sm uppercase tracking-widest font-black">View All Collection</span>
            <ArrowRight size={20} />
          </motion.button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="glass-card rounded-[2.5rem] h-[500px] animate-pulse bg-white/50" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {mapProductsToCardFormat(products).map((product) => (
              <ProductCard
                key={product.id}
                product={product as any}
                onViewDetails={() => handleViewDetails(product.slug)}
              />
            ))}
          </div>
        )}

        <div className="mt-16 text-center lg:hidden">
          <button
            onClick={() => navigate('/products')}
            className="btn-premium w-full sm:w-auto px-10 py-5"
          >
            See All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
