import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../Redux/slices/cartSlice";
import type { AppDispatch } from "../../Redux/store";
import {
  ChevronRight,
  Star,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  Shield,
  ChevronLeft,
  Check,
  Share2,
} from "lucide-react";
import { getProductBySlug, getProductsByCategory } from "../../services/productService";
import { getReviewsByProduct } from "../../services/reviewService";
import Header from "../../components/Publicwebsite/Layouts/Header";
import Footer from "../../components/Publicwebsite/Layouts/Footer";
import { ProductCarousel } from "../../components/products/ProductCarousel";
import Button from "../../components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/Tabs";
import ReviewList from "../../components/Publicwebsite/Sections/ReviewList";
import ReviewForm from "../../components/Publicwebsite/Sections/ReviewForm";
import { cn } from "../../lib/utils";
import toast from "react-hot-toast";

const features = [
  { icon: Truck, title: "Free Delivery", desc: "On orders over Rs. 500" },
  { icon: RotateCcw, title: "Easy Returns", desc: "7 days return policy" },
  { icon: Shield, title: "Secure", desc: "100% secure checkout" },
];

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const [product, setProduct] = useState<any | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [reviewStats, setReviewStats] = useState<{
    total: number;
    averageRating: number;
    ratingDistribution: Record<number, number>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);

  const fetchReviewStats = async (productId: number) => {
    try {
      const reviewResponse = await getReviewsByProduct(productId, { limit: 0 });
      if (reviewResponse.stats) {
        setReviewStats(reviewResponse.stats);
      }
    } catch (err) {
      console.error("Failed to fetch review stats:", err);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      // Safety check for Slug
      if (!slug) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await getProductBySlug(slug);
        const productData = response.data?.data || response.data;
        setProduct(productData);

        // Fetch review stats for this product
        if (productData.id) {
          await fetchReviewStats(productData.id);
        }

        // Fetch related products
        if (productData.categoryId) {
          try {
            const relatedRes = await getProductsByCategory(productData.categoryId, { limit: 6 });
            const relatedData = relatedRes.data?.data || relatedRes.data;
            // Filter out current product
            if (Array.isArray(relatedData)) {
              setRelatedProducts(relatedData.filter((p: any) => p.id !== productData.id));
            }
          } catch (err) {
            console.error("Failed to fetch related products", err);
          }
        }

      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    try {
      if (!isAuthenticated) {
        toast.error("Please login to add items to cart");
        navigate('/login');
        return;
      }

      const productImage = displayImages?.[0] || '/api/placeholder/400/400';

      await dispatch(addToCart({
        sku: product.sku,
        quantity,
        name: product.title,
        image: productImage,
        description: product.description?.substring(0, 100) || 'High-quality product'
      })).unwrap();

      toast.success(`Added ${quantity} x ${product.title} to your cart!`, {
        style: {
          border: '1px solid #10B981',
          padding: '16px',
          color: '#713200',
        },
        iconTheme: {
          primary: '#10B981',
          secondary: '#FFFAEE',
        },
      });
    } catch (error) {
      console.error('Add to cart failed:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    try {
      if (!isAuthenticated) {
        toast.error("Please login to place an order");
        navigate('/login');
        return;
      }

      // Add to cart using Redux
      const productImage = displayImages?.[0] || '/api/placeholder/400/400';

      await dispatch(addToCart({
        sku: product.sku,
        quantity,
        name: product.title,
        image: productImage,
        description: product.description?.substring(0, 100) || 'High-quality product'
      })).unwrap();

      // Navigate to checkout instead of cart
      navigate('/checkout');
    } catch (error) {
      console.error('Buy now failed:', error);
      toast.error('Failed to proceed to checkout');
    }
  };

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      toast.error("Please login to write a review");
      navigate('/login');
      return;
    }
    setShowReviewForm(!showReviewForm);
  };

  const handleEditReview = (review: any) => {
    if (!isAuthenticated) {
      toast.error("Please login to edit your review");
      navigate('/login');
      return;
    }
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleReviewDeleted = () => {
    if (product?.id) {
      fetchReviewStats(product.id); // Refresh stats after deletion
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-grow flex justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            <p className="text-gray-500 font-medium">Loading product details...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center flex-grow flex flex-col justify-center items-center max-w-md">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingCart className="h-10 w-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h1>
          <p className="text-gray-500 mb-8">The product you are looking for might have been removed or is temporarily unavailable.</p>
          <Button variant="primary" onClick={() => navigate('/')}>Continue Shopping</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const discountPercent =
    product.mrp && product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  // Handle images array from backend
  const getImages = () => {
    if (!product) return [];

    if (!product.images) return ['/api/placeholder/400/400'];

    let imgs = product.images;

    // If it's a string, try to parse it as JSON, otherwise treat as single image
    if (typeof imgs === 'string') {
      if (imgs.trim().startsWith('[') && imgs.trim().endsWith(']')) {
        try {
          imgs = JSON.parse(imgs);
        } catch (e) {
          console.error("Failed to parse images JSON:", e);
          return [imgs];
        }
      } else {
        return [imgs];
      }
    }

    return Array.isArray(imgs) ? imgs : [];
  };

  const rawImages = getImages();
  const displayImages = rawImages.length > 0
    ? rawImages.map((img: string) => img.startsWith('/') || img.startsWith('http') ? img : `/${img}`)
    : ['/api/placeholder/400/400'];

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-6 md:py-10">
        {/* Breadcrumb - Clean & Minimal */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <Link
            to={product.category?.slug ? `/category/${product.category.slug}` : '/categories'}
            className="hover:text-primary-600 transition-colors"
          >
            {product.category?.name || 'Category'}
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-900 font-medium truncate">
            {product.title}
          </span>
        </nav>

        {/* Product Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 mb-20">
          {/* Left Column: Image Gallery */}
          <div className="space-y-6">
            <div
              className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden bg-gray-50 group border border-gray-100 shadow-sm cursor-zoom-in"
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: isZoomed ? 1.5 : 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={displayImages[selectedImage]}
                  alt={product.title}
                  className={cn(
                    "w-full h-full object-contain mix-blend-multiply p-4 transition-transform duration-500 ease-out",
                    isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                  )}
                />
              </AnimatePresence>

              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {discountPercent > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    -{discountPercent}% OFF
                  </span>
                )}
                {/* New Arrival Badge Mockup */}
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg w-max">
                  NEW
                </span>
              </div>

              <div className="absolute top-4 right-4 z-10">
                <button
                  type="button"
                  aria-label="Share"
                  className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-sm hover:shadow-md transition-all text-gray-600 hover:text-primary-600"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>

              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {displayImages.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all p-2 snap-center bg-gray-50",
                      selectedImage === index
                        ? "border-primary-600 ring-2 ring-primary-50 scale-105"
                        : "border-transparent hover:border-gray-200 grayscale hover:grayscale-0 opacity-70 hover:opacity-100"
                    )}
                  >
                    <img
                      src={img}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details */}
          <div className="flex flex-col">
            <div className="mb-auto">
              <div className="flex items-center gap-2 mb-3">
                <Link to={product.category?.slug ? `/category/${product.category.slug}` : '/categories'} className="text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full hover:bg-primary-100 transition-colors">
                  {product.category?.name}
                </Link>
                {product.stock > 0 ? (
                  <div className="flex items-center gap-1 text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <Check className="h-3 w-3" /> In Stock
                  </div>
                ) : (
                  <div className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
                    Out of Stock
                  </div>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {product.title}
              </h1>

              {/* Rating Summary */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-gray-900">
                      {reviewStats ? reviewStats.averageRating.toFixed(1) : '0.0'}
                    </span>
                  </div>
                  <span className="text-gray-400 text-sm">|</span>
                  <a href="#reviews" className="text-sm font-medium text-gray-500 hover:text-primary-600 underline-offset-4 hover:underline">
                    {reviewStats ? reviewStats.total : 0} Review{reviewStats && reviewStats.total !== 1 ? 's' : ''}
                  </a>
                  <span className="text-gray-400 text-sm">|</span>
                  <span className="text-sm text-gray-500">
                    {Math.floor(Math.random() * 500) + 100}k Sold
                  </span>
                </div>

                {/* Star Distribution */}
                {reviewStats && reviewStats.total > 0 && (
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const starCount = reviewStats.ratingDistribution?.[star] || 0;
                      const percentage = (starCount / reviewStats.total) * 100;

                      return (
                        <div key={star} className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-1 min-w-[60px]">
                            <span className="text-gray-600 text-sm">{star}</span>
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-600 min-w-[50px] text-right">
                            {starCount}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Price Block */}
              <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-4xl font-extrabold text-gray-900 tracking-tight">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  {product.mrp > product.price && (
                    <span className="text-xl text-gray-400 line-through font-medium mb-1">
                      Rs. {product.mrp.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 font-medium">Inclusive of all taxes</p>
              </div>

              <div className="prose prose-sm text-gray-600 mb-8 line-clamp-3">
                {product.description}
              </div>

              {/* Selector & Actions */}
              <div className="space-y-6 pt-6 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  {/* Quantity */}
                  {product.stock > 0 && (
                    <div className="flex items-center justify-between border-2 border-gray-200 rounded-xl overflow-hidden bg-white hover:border-primary-200 transition-colors w-full sm:w-auto min-w-[140px]">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        className="p-3.5 hover:bg-gray-50 text-gray-600 hover:text-primary-600 transition-colors"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-lg font-bold w-8 text-center">{quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        className="p-3.5 hover:bg-gray-50 text-gray-600 hover:text-primary-600 transition-colors"
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        disabled={quantity >= product.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* Wishlist Mobile */}
                  <button
                    type="button"
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    className={cn(
                      "sm:hidden flex items-center justify-center p-3.5 border-2 border-gray-200 rounded-xl",
                      isWishlisted ? "text-red-500 border-red-200 bg-red-50" : "text-gray-400 hover:text-gray-600"
                    )}
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    <Heart className={cn("h-6 w-6", isWishlisted && "fill-current")} />
                  </button>
                </div>


                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="primary"
                    className="flex-1 h-14 text-lg font-semibold rounded-xl shadow-lg shadow-primary-500/20 gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    className="hidden sm:flex h-14 w-14 p-0 items-center justify-center rounded-xl border-gray-200 hover:border-red-200 hover:bg-red-50 group transition-all"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    <Heart
                      className={cn("h-6 w-6 text-gray-400 group-hover:text-red-500 transition-colors", isWishlisted && "text-red-500 fill-current")}
                    />
                  </Button>
                  <Button
                    className="flex-1 h-14 text-lg font-semibold rounded-xl border-2 border-gray-900 bg-gray-900 text-white hover:bg-gray-800 hover:border-gray-800 transition-all"
                    onClick={handleBuyNow}
                    disabled={product.stock <= 0}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100">
                {features.map((feature) => (
                  <div key={feature.title} className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-2xl hover:bg-primary-50/50 transition-colors">
                    <div className="mb-3 p-2.5 bg-white rounded-xl shadow-sm text-primary-600">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <p className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-1">{feature.title}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 leading-tight">{feature.desc}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* Content Tabs Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <Tabs defaultValue="description" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-gray-100/80 p-1 rounded-full inline-flex h-auto">
                <TabsTrigger
                  value="description"
                  className="rounded-full px-8 py-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-md transition-all"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="rounded-full px-8 py-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-md transition-all"
                >
                  Specifications
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-full px-8 py-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-md transition-all"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="description" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm"
              >
                <h3 className="text-xl font-bold mb-4">Product Description</h3>
                <div className="prose max-w-none text-gray-600 leading-relaxed">
                  <p>
                    {product.description ||
                      "This high-quality product is sourced directly from local Nepali farmers. We ensure freshness by maintaining a cold chain from farm to your doorstep."}
                  </p>
                  <p className="mt-4">
                    We prioritize quality and freshness in every item we deliver. Our team meticulously selects products to ensure they meet our high standards. Whether you are cooking a family meal or stocking up your pantry, you can trust our products to deliver authentic taste and nutrition.
                  </p>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="details" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm"
              >
                <h3 className="text-xl font-bold mb-6">Technical Specifications</h3>
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Category</span>
                    <span className="font-semibold text-gray-900 text-right">{product.category?.name}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">SKU / Code</span>
                    <span className="font-semibold text-gray-900 text-right">{product.sku || product.slug || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Stock Status</span>
                    <span className={cn("font-semibold text-right", product.stock > 0 ? "text-green-600" : "text-red-600")}>
                      {product.stock > 0 ? `${product.stock} units left` : 'Out of Stock'}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Created Date</span>
                    <span className="font-semibold text-gray-900 text-right">
                      {new Date(product.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Last Updated</span>
                    <span className="font-semibold text-gray-900 text-right">
                      {new Date(product.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Product ID</span>
                    <span className="font-semibold text-gray-900 text-right">{product.id}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Availability</span>
                    <span className={cn("font-semibold text-right", product.isActive ? "text-green-600" : "text-red-600")}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-0" id="reviews">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className=""
              >
                <div className="flex flex-col md:flex-row gap-10 items-center justify-between mb-6">
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-2">Customer Reviews</h3>
                  </div>
                  <Button variant="outline" className="h-12 border-gray-300" onClick={handleWriteReview}>
                    Write a Review
                  </Button>
                </div>
                {showReviewForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-8"
                  >
                    <ReviewForm
                      productId={product.id}
                      editingReview={editingReview}
                      onReviewSubmit={async () => {
                        setShowReviewForm(false);
                        setEditingReview(null);
                        if (product?.id) {
                          await fetchReviewStats(product.id);
                        }
                      }}
                      onReviewCancel={() => {
                        setEditingReview(null);
                      }}
                    />
                  </motion.div>
                )}
                <ReviewList
                  productId={product.id}
                  onReviewEdit={handleEditReview}
                  onReviewDeleted={handleReviewDeleted}
                />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-gray-100 pt-16">
            <ProductCarousel
              title="You May Also Like"
              subtitle="Curated products just for you"
              products={relatedProducts}
              viewAllLink={product.category?.slug ? `/category/${product.category.slug}` : '/categories'}
            />
          </div>
        )}
      </div>
      <Footer />
      {/* Lightbox/Zoom Effect Modal could go here */}
    </div>
  );
}
