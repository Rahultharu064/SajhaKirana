import React from 'react';
import { Edit, Trash } from 'lucide-react';
import Button from '../../ui/Button';

interface AdminProductCardProps {
  product: {
    id: number;
    title: string;
    sku: string;
    price: number;
    mrp: number;
    stock: number;
    category?: { name: string };
    images: string[];
    isActive: boolean;
  };
  onEdit?: (productId: number) => void;
  onDelete?: (productId: number) => void;
}

const AdminProductCard: React.FC<AdminProductCardProps> = ({ product, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border">
      <div className="relative">
        {product.images && Array.isArray(product.images) && product.images.length > 0 ? (
          <img
            src={typeof product.images[0] === 'string' && !product.images[0].startsWith('http') ? `${import.meta.env.VITE_API_URL || 'http://localhost:5003'}/${product.images[0].replace(/^\//, '')}` : product.images[0]}
            alt={product.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${product.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
            }`}>
            {product.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.title}</h3>

        <div className="space-y-1 text-sm text-gray-600 mb-3">
          <p><span className="font-medium">SKU:</span> {product.sku}</p>
          <div className="flex items-center space-x-2">
            <span className="font-medium">Price:</span>
            <span className="text-green-600 font-semibold">Rs. {product.price}</span>
            {product.mrp > product.price && (
              <span className="text-gray-400 line-through">Rs. {product.mrp}</span>
            )}
          </div>
          <p><span className="font-medium">Stock:</span> {product.stock}</p>
          <p><span className="font-medium">Category:</span> {product.category?.name || 'No Category'}</p>
        </div>

        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(product.id)}
            className="bg-blue-50 text-blue-600 hover:bg-blue-100"
            startIcon={<Edit size={14} />}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(product.id)}
            className="bg-red-50 text-red-600 hover:bg-red-100"
            startIcon={<Trash size={14} />}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminProductCard;
