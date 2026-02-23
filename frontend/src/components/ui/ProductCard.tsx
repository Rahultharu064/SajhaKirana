import { Heart, Eye, Star, Plus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import type { AppDispatch } from '../../Redux/store';
import { addToCart } from '../../Redux/slices/cartSlice';
import toast from 'react-hot-toast';
import { useState } from 'react';

interface ProductCardProps {
  product: {
    id: number;
    title: string;
    price: number;
    mrp: number;
    image: string;
    sku: string;
    discount?: number;
    rating?: number;
    slug?: string;
  };
  onViewDetails?: (productId: string) => void;
}

const ProductCard = ({ product, onViewDetails }: ProductCardProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await dispatch(addToCart({ sku: product.sku, quantity: 1 })).unwrap();
      toast.success('Added to fresh basket!', {
        icon: '🍃',
        style: {
          borderRadius: '20px',
          background: '#064e3b',
          color: '#fff',
          fontWeight: 'bold'
        },
      });
    } catch (error) {
      console.error('Add to cart failed:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from favorites' : 'Saved for later', {
      icon: isWishlisted ? '💔' : '💚',
      style: { borderRadius: '20px' }
    });
  };

  const imageUrl = product.image?.startsWith('http')
    ? product.image
    : `${import.meta.env.VITE_API_URL || 'http://localhost:5003'}/${product.image?.replace(/^\//, '')}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails && onViewDetails(product.slug || product.id.toString())}
      className="group cursor-pointer"
    >
      <div className="glass-card rounded-[2.5rem] p-4 flex flex-col h-full relative overflow-hidden">
        {/* Image Section */}
        <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-50 mb-6">
          <motion.img
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6 }}
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/400x500?text=Premium+Fresh';
            }}
          />

          {/* Discount Tag */}
          {product.discount && product.discount > 0 && (
            <div className="absolute top-4 left-4 glass px-3 py-1.5 rounded-full z-10">
              <span className="text-xs font-black text-emerald-600">-{product.discount}%</span>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-4 right-4 p-3 rounded-2xl transition-all duration-300 z-10 ${isWishlisted ? 'bg-rose-500 text-white shadow-lg' : 'glass text-slate-400 hover:text-rose-500'
              }`}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
          </button>

          {/* Quick Actions Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-4 left-4 right-4 flex gap-2 z-10"
              >
                <button
                  onClick={(e) => { e.stopPropagation(); onViewDetails && onViewDetails(product.slug || product.id.toString()) }}
                  className="flex-1 p-3.5 glass hover:bg-white text-slate-900 rounded-2xl flex items-center justify-center gap-2"
                >
                  <Eye size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">Detail</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col justify-between px-2 pb-2">
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  className={i < (product.rating || 5) ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                />
              ))}
              <span className="text-[10px] font-bold text-slate-400 ml-1">({(product.rating || 5).toFixed(1)})</span>
            </div>

            <h3 className="font-black text-slate-800 text-base leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2 uppercase tracking-tight">
              {product.title}
            </h3>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-900">Rs. {product.price.toLocaleString()}</span>
              {product.mrp > product.price && (
                <span className="text-xs text-slate-400 line-through font-bold">Rs. {product.mrp.toLocaleString()}</span>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className="w-12 h-12 rounded-2xl bg-brand-gradient text-white flex items-center justify-center shadow-lg shadow-emerald-500/30"
            >
              <Plus size={24} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
