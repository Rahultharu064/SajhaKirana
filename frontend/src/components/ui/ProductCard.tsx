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
      className="group cursor-pointer h-full"
    >
      <div className="glass-card rounded-[2.5rem] p-3 flex flex-col h-full relative overflow-hidden">
        {/* Image Section */}
        <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-white mb-4">
          <motion.img
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-contain p-4"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/400x500?text=Premium+Fresh';
            }}
          />

          {/* Glass Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />

          {/* Discount Tag */}
          {product.discount && product.discount > 0 && (
            <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full z-10 shadow-lg shadow-emerald-500/20">
              <span className="text-[10px] font-black uppercase tracking-wider">-{product.discount}%</span>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-4 right-4 p-2.5 rounded-2xl transition-all duration-300 z-10 ${isWishlisted ? 'bg-rose-500 text-white shadow-lg' : 'bg-white/80 backdrop-blur-md text-slate-400 hover:text-rose-500 shadow-sm'
              }`}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
          </button>

          {/* Detail Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/5 backdrop-blur-[2px] flex-center z-0"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl text-slate-900"
                >
                  <Eye size={20} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col px-2 pb-2">
          <div className="space-y-1 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md">Fresh</span>
              <div className="flex items-center gap-0.5">
                <Star size={10} className="fill-amber-400 text-amber-400" />
                <span className="text-[10px] font-bold text-slate-500">{(product.rating || 4.5).toFixed(1)}</span>
              </div>
            </div>

            <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2">
              {product.title}
            </h3>
          </div>

          <div className="mt-auto flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-black text-slate-900">Rs. {product.price.toLocaleString()}</span>
              {product.mrp > product.price && (
                <span className="text-xs text-slate-400 line-through font-bold">Rs. {product.mrp.toLocaleString()}</span>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className="w-10 h-10 rounded-xl bg-brand-gradient text-white flex-center shadow-lg shadow-emerald-500/20 active:shadow-inner"
            >
              <Plus size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
