import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { useDispatch } from 'react-redux';
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
  };
  onViewDetails?: (productId: number) => void;
}

const ProductCard = ({ product, onViewDetails }: ProductCardProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = async () => {
    try {
      await dispatch(addToCart({ sku: product.sku, quantity: 1 })).unwrap();
      toast.success('Added to cart!', {
        icon: '🛒',
        style: {
          borderRadius: '12px',
          background: '#10b981',
          color: '#fff',
        },
      });
    } catch (error) {
      console.error('Add to cart failed:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', {
      icon: isWishlisted ? '💔' : '❤️',
    });
  };

  return (
    <div
      className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-emerald-200 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-slate-100 overflow-hidden">
        <img
          src={
            product.image?.startsWith('http')
              ? product.image
              : `${import.meta.env.VITE_API_URL || 'http://localhost:5003'}/${product.image?.replace(/^\//, '')}`
          }
          alt={product.title}
          className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=No+Image';
            (e.target as HTMLImageElement).onerror = null;
          }}
        />



        {/* Discount Badge */}
        {product.discount && product.discount > 0 && (
          <div className="px-3 py-1.5 bg-rose-500 text-white rounded-full text-xs font-bold shadow-md flex items-center gap-1">
            <span className="text-white/80">-</span>
            {product.discount}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-2.5 rounded-full transition-all duration-300 shadow-lg ${isWishlisted
            ? 'bg-rose-500 text-white scale-110'
            : 'bg-white/90 backdrop-blur-sm text-slate-400 hover:bg-rose-50 hover:text-rose-500'
            }`}
          aria-label="Add to wishlist"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Actions - Appear on Hover */}
        <div className={`absolute bottom-3 left-3 right-3 flex gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button
            onClick={handleAddToCart}
            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
          <button
            onClick={() => onViewDetails && onViewDetails(product.id)}
            className="p-2.5 bg-white/95 backdrop-blur-sm text-slate-700 rounded-xl hover:bg-slate-50 transition-colors shadow-lg"
            aria-label="View details"
          >
            <Eye size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={12}
              className={i < Math.floor(product.rating || 4.5)
                ? "fill-amber-400 text-amber-400"
                : "text-slate-200"}
            />
          ))}
          <span className="text-[11px] text-slate-400 font-medium ml-1">
            ({(product.rating || 4.5).toFixed(1)})
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-slate-800 line-clamp-2 text-sm leading-snug group-hover:text-emerald-600 transition-colors">
          {product.title}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-emerald-600">
            Rs. {product.price.toLocaleString()}
          </span>
          {product.mrp > product.price && (
            <span className="text-sm text-slate-400 line-through">
              Rs. {product.mrp.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
