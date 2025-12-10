import { Heart } from 'lucide-react';
import Button from './Button';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../Redux/store';
import { addToCart } from '../../Redux/slices/cartSlice';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: {
    id: number;
    title: string;
    price: number;
    mrp: number;
    image: string;
    sku: string;
    discount?: number;
  };
  onViewDetails?: (productId: number) => void;
}

const ProductCard = ({ product, onViewDetails }: ProductCardProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = async () => {
    try {
      await dispatch(addToCart({ sku: product.sku, quantity: 1 })).unwrap();
      toast.success('Product added to cart!');
    } catch (error) {
      console.error('Add to cart failed:', error);
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={product.image?.startsWith('http') ? product.image : `/${product.image?.replace(/^\//, '')}`}
          alt={product.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/api/placeholder/400/400';
            (e.target as HTMLImageElement).onerror = null;
          }}
        />
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
            -{product.discount}%
          </div>
        )}
        <Button
          className="absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-opacity"
          aria-label="Add to wishlist"
          variant="ghost"
          size="xs"
        >
          <Heart className="h-4 w-4 text-gray-600" />
        </Button>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.title}</h3>

        <div className="flex items-center space-x-2 mb-2">
          <span className="text-lg font-semibold text-emerald-600">Rs. {product.price}</span>
          {product.mrp > product.price && (
            <span className="text-sm text-gray-500 line-through">Rs. {product.mrp}</span>
          )}
        </div>



        <div className="space-y-2">
          <Button variant="success" fullWidth onClick={handleAddToCart}>
            Add to Cart
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={() => onViewDetails && onViewDetails(product.id)}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
