import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  Check,
} from "lucide-react";
import { getProductById, getProductsByCategory } from "../../services/productService";
import Header from "../../components/Publicwebsite/Layouts/Header";
import Footer from "../../components/Publicwebsite/Layouts/Footer";
import { ProductCarousel } from "../../components/products/ProductCarousel";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/Tabs";
import { cn } from "../../lib/utils";
import toast from "react-hot-toast";

const features = [
  { icon: Truck, title: "Free Delivery", desc: "On orders over Rs. 500" },
  { icon: RotateCcw, title: "Easy Returns", desc: "7 days return policy" },
  { icon: Shield, title: "Secure", desc: "100% secure checkout" },
];

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      // Safety check for ID
      if (!id || isNaN(parseInt(id))) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await getProductById(parseInt(id));
        const productData = response.data?.data || response.data;
        setProduct(productData);

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
  }, [id]);

  const handleAddToCart = () => {
    toast.success(`Added ${quantity} x ${product.title} to your cart.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-grow flex justify-center items-center">
          Loading...
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center flex-grow flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button variant="primary" onClick={() => navigate('/')}>Browse Products</Button>
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
  const displayImages = (product.images && product.images.length > 0)
    ? product.images.map((img: string) => img.startsWith('/') || img.startsWith('http') ? img : `/${img}`)
    : ['/api/placeholder/400/400'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            to={product.categoryId ? `/category/${product.categoryId}` : '/products'}
            className="hover:text-blue-600 transition-colors"
          >
            {product.category?.name || 'Category'}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 truncate max-w-[150px]">
            {product.title}
          </span>
        </nav>

        {/* Product Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-gray-100">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={displayImages[selectedImage]}
                alt={product.title}
                className="w-full h-full object-contain mix-blend-multiply"
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discountPercent > 0 && (
                  <Badge variant="danger">-{discountPercent}% OFF</Badge>
                )}
                {/* Add logic for new/bestseller badges if available in data */}
              </div>
            </div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {displayImages.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all bg-white",
                      selectedImage === index
                        ? "border-blue-600 ring-2 ring-blue-50"
                        : "border-transparent opacity-70 hover:opacity-100 hover:border-gray-200"
                    )}
                  >
                    <img
                      src={img}
                      alt={`${product.title} view ${index + 1}`}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Category & Title */}
            <div>
              <p className="text-sm text-blue-600 font-medium mb-2">
                {product.category?.name}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
            </div>

            {/* Rating - Placeholder for now */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < 4 // Mock rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className="font-medium">4.0</span>
              <span className="text-gray-500">
                (0 reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                Rs. {product.price}
              </span>
              {product.mrp > product.price && (
                <span className="text-xl text-gray-500 line-through">
                  Rs. {product.mrp}
                </span>
              )}
              {discountPercent > 0 && (
                <Badge variant="success" className="ml-2">
                  Save {discountPercent}%
                </Badge>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              {product.description ||
                "No description available."}
            </p>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-green-600 font-medium">In Stock</span>
                </>
              ) : (
                <Badge variant="danger">Out of Stock</Badge>
              )}
            </div>

            {/* Quantity & Actions */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                  <button
                    className="p-3 hover:bg-gray-50"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    className="p-3 hover:bg-gray-50"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Add to Cart */}
              <Button
                variant="primary"
                className="flex-1 md:flex-initial gap-2 h-12 px-8 text-lg"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>

              {/* Wishlist */}
              <Button
                variant="outline"
                className={cn("h-12 w-12 p-0 flex items-center justify-center rounded-xl border-gray-300", isWishlisted && "text-red-500 border-red-200 bg-red-50")}
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart
                  className={cn("h-5 w-5", isWishlisted && "fill-current")}
                />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 mb-2">
                    <feature.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">{feature.title}</p>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <div className="mb-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b border-gray-200 rounded-none bg-transparent h-auto p-0 mb-6 gap-8">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 pb-3 px-0 font-semibold text-gray-500 hover:text-gray-700"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 pb-3 px-0 font-semibold text-gray-500 hover:text-gray-700"
              >
                Details
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 pb-3 px-0 font-semibold text-gray-500 hover:text-gray-700"
              >
                Reviews (0)
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-0">
              <div className="prose prose-sm max-w-none text-gray-600">
                <p>
                  {product.description ||
                    "This high-quality product is sourced directly from local Nepali farmers. We ensure freshness by maintaining a cold chain from farm to your doorstep."}
                </p>
              </div>
            </TabsContent>
            <TabsContent value="details" className="mt-0">
              <div className="grid gap-4 max-w-2xl">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium text-gray-900">{product.category?.name}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">SKU</span>
                  <span className="font-medium text-gray-900">{product.sku || product.slug}</span>
                </div>
                {/* Add more details as needed */}
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-0">
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <p>Customer reviews coming soon!</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <ProductCarousel
            title="You May Also Like"
            subtitle="Products from the same category"
            products={relatedProducts}
            viewAllLink={product.categoryId ? `/category/${product.categoryId}` : '/products'}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}
