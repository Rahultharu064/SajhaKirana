import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Publicwebsite/Layouts/Header';
import Footer from '../../components/Publicwebsite/Layouts/Footer';
import { getProductById } from '../../services/productService';
import { Eye, ShoppingCart, Heart } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  mrp: number;
  stock: number;
  categoryId: number;
  images: string[];
  isActive: boolean;
  category: {
    id: number;
    name: string;
    slug: string;
  };
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const response = await getProductById(parseInt(id));
        setProduct(response.data?.data || response.data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center py-16">
          <div className="text-lg text-gray-600">Loading product...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-16">
          <p className="text-red-600">{error || 'Product not found'}</p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const images = (product.images && product.images.length > 0)
    ? product.images.map(img => img.startsWith('/') ? img : `/${img}`)
    : ['/api/placeholder/300/200'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <button
              onClick={() => navigate('/')}
              className="hover:text-blue-600 transition-colors"
            >
              Home
            </button>
            <span>/</span>
            <button
              onClick={() => navigate(`/category/${product.categoryId}`)}
              className="hover:text-blue-600 transition-colors"
            >
              {product.category?.name || 'Category'}
            </button>
            <span>/</span>
            <span className="text-gray-900">{product.title}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={images[selectedImage].startsWith('http') ? images[selectedImage] : images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                {discountPercent > 0 && (
                  <Badge
                    variant="danger"
                    className="absolute top-4 left-4"
                  >
                    -{discountPercent}%
                  </Badge>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-blue-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image.startsWith('http') ? image : image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              {/* Title and Category */}
              <div>
                <p className="text-sm text-blue-600 font-medium mb-2">
                  {product.category?.name || 'Category'}
                </p>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {product.title}
                </h1>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-bold text-gray-900">
                  Rs. {product.price}
                </span>
                {product.mrp > product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    Rs. {product.mrp}
                  </span>
                )}
                {discountPercent > 0 && (
                  <Badge variant="secondary">
                    {discountPercent}% off
                  </Badge>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                {product.stock > 0 ? (
                  <div className="flex items-center text-green-600">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                    In Stock ({product.stock} available)
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="prose prose-sm max-w-none text-gray-600">
                <p>{product.description}</p>
              </div>

              {/* SKU */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">SKU:</span>
                <span className="font-medium">{product.slug}</span>
              </div>

              {/* Quantity and Actions */}
              <div className="space-y-4">
                {/* Quantity Selector */}
                {product.stock > 0 && (
                  <div className="flex items-center gap-4">
                    <span className="font-medium">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 text-gray-600 hover:text-gray-900"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 py-2 border-x border-gray-300">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="px-3 py-2 text-gray-600 hover:text-gray-900"
                        disabled={quantity >= product.stock}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {product.stock > 0 ? (
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                      onClick={() => {
                        // TODO: Add to cart functionality
                        alert(`Added ${quantity} x ${product.title} to cart`);
                      }}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </Button>
                  ) : (
                    <Button disabled className="flex-1">
                      Out of Stock
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                  >
                    <Heart className="h-5 w-5" />
                    Add to Wishlist
                  </Button>
                </div>
              </div>

              {/* Product Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-4 h-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-gray-900">Quality</p>
                  <p className="text-xs text-gray-500">Guaranteed</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-4 h-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 102 0h2.05a2.5 2.5 0 014.9 0H17a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 011 1v.17a2.5 2.5 0 010 4.66V12a1 1 0 01-2 0V9.83a2.5 2.5 0 010-4.66V8a1 1 0 012 0z" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-gray-900">Fast Delivery</p>
                  <p className="text-xs text-gray-500">Same Day</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-4 h-4 text-orange-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 000 16zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-gray-900">Support</p>
                  <p className="text-xs text-gray-500">24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetail;
