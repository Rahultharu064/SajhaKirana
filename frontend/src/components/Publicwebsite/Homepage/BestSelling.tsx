import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../../ui/ProductCard';
import { getAllProducts } from '../../../services/productService';
import { Crown, ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  price: number;
  mrp: number;
  sku: string;
  slug: string;
  images: string[];
}

const BestSelling = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
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

  const handleViewDetails = (slugOrId: string) => {
    navigate(`/product/${slugOrId}`);
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
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-50 rounded-full blur-3xl opacity-50"></div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200">
            <Crown size={16} className="text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">Most Popular</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900">
            Best <span className="text-emerald-600">Selling</span>
          </h2>
          <p className="text-slate-600 max-w-lg mx-auto text-base sm:text-lg">
            Most loved products by our customers this week
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="relative">
            {/* Scroll Indicators */}
            <div className="hidden lg:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10">
              <button
                title="Scroll Left"
                aria-label="Scroll Left"
                className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-400 hover:text-violet-600 hover:shadow-xl transition-all"
              >
                <ChevronLeft size={24} />
              </button>
            </div>
            <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
              <button
                title="Scroll Right"
                aria-label="Scroll Right"
                className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-400 hover:text-violet-600 hover:shadow-xl transition-all"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Products Carousel */}
            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
              <div className="flex gap-6 pb-4 min-w-max lg:grid-products lg:min-w-0">
                {mapProductsToCardFormat(products).map((product, index) => (
                  <motion.div
                    key={`bestseller-${product.id}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-shrink-0 w-72 lg:w-auto"
                  >
                    <div className="relative">
                      {index === 0 && (
                        <div className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-md flex items-center gap-1">
                          <Crown size={12} />
                          #1 Best Seller
                        </div>
                      )}
                      <ProductCard
                        product={product}
                        onViewDetails={handleViewDetails}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSelling;
