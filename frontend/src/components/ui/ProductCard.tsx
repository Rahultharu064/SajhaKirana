import { Heart } from 'lucide-react';
import Button from './Button';

interface ProductCardProps {
  product: {
    id: number;
    title: string;
    price: number;
    mrp: number;
    rating: number;
    image: string;
    discount?: number;
  };
  onViewDetails?: (productId: number) => void;
}

const ProductCard = ({ product, onViewDetails }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover"
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

        <div className="flex items-center space-x-1 mb-3">
          <div className="flex text-yellow-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-600">({product.rating})</span>
        </div>

        <div className="space-y-2">
          <Button variant="success" fullWidth>
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
