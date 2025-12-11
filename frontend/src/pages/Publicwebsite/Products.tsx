
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  SlidersHorizontal,
  X,
  Star,
} from "lucide-react";
import Header from "../../components/Publicwebsite/Layouts/Header";
import Footer from "../../components/Publicwebsite/Layouts/Footer";
import ProductCard from "../../components/ui/ProductCard";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { Checkbox } from "../../components/ui/Checkbox";
import { Slider } from "../../components/ui/Slider";
import { cn } from "../../lib/utils";
import { getAllProducts } from "../../services/productService";
import { getCategories, type Category } from "../../services/categoryService";

const sortOptions = [
  { value: "popular", label: "Popularity" },
  { value: "priceLow", label: "Price: Low to High" },
  { value: "priceHigh", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  //   { value: "rating", label: "Rating" }, // TODO: Implement backend support
];

// Reuse logic from ProductDetail or create helper
// Reuse logic from ProductDetail or create helper
const getProductImage = (product: any) => {
  if (!product.images) return '/api/placeholder/400/400';
  let imgs = product.images;
  if (typeof imgs === 'string') {
    try {
      if (imgs.trim().startsWith('[')) {
        imgs = JSON.parse(imgs);
      } else {
        return imgs.startsWith('/') || imgs.startsWith('http') ? imgs : '/' + imgs;
      }
    } catch (e) {
      return imgs.startsWith('/') || imgs.startsWith('http') ? imgs : '/' + imgs;
    }
  }
  if (Array.isArray(imgs) && imgs.length > 0) {
    const img = imgs[0];
    return img.startsWith('/') || img.startsWith('http') ? img : '/' + img;
  }
  return '/api/placeholder/400/400';
};

export default function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  // const { slug } = useParams(); // Note: This slug might be from a route like /category/:slug if we use this component there

  // State
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });
  const [showFilters, setShowFilters] = useState(false);

  // Filter States
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 10000]); // Using array for Slider
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getAllProducts({
          page: pagination.page,
          limit: 12,
          priceMin: priceRange[0],
          priceMax: priceRange[1] < 10000 ? priceRange[1] : undefined,
          inStock: inStockOnly,
          sort: sortBy as any,
          category: selectedCategories.length > 0 ? selectedCategories : undefined
        });
        const data = response.data;
        if (data.success) {
          setError(null); // Clear any previous errors
          const mappedProducts = data.data.map((p: any) => ({
            id: p.id,
            title: p.title,
            price: p.price,
            mrp: p.mrp,
            rating: 4.5, // Placeholder
            image: getProductImage(p),
            sku: p.sku,
            discount: p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0,
            slug: p.slug
          }));

          setProducts(mappedProducts);
          setPagination({
            page: data.pagination.page,
            total: data.pagination.total,
            pages: data.pagination.pages
          });
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
        setProducts([]); // Clear products on error
      } finally {
        setLoading(false);
      }
    };

    // Debounce
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [pagination.page, priceRange, inStockOnly, sortBy, selectedCategories]);


  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 10000]);
    setInStockOnly(false);
    setMinRating(0);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      window.scrollTo(0, 0);
    }
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 10000 ||
    inStockOnly ||
    minRating > 0;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-primary-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/products" className="hover:text-primary-600 transition-colors">
            Products
          </Link>
        </nav>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            All Products
          </h1>
          <p className="text-gray-500">
            {pagination.total} products found
          </p>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FiltersPanel
              categories={categories}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              minRating={minRating}
              setMinRating={setMinRating}
              clearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-6">
              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                // size="sm" 
                className="lg:hidden gap-2"
                onClick={() => setShowFilters(true)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="primary" className="ml-1 px-1.5 py-0.5 h-auto text-xs">
                    {selectedCategories.length +
                      (inStockOnly ? 1 : 0) +
                      (minRating > 0 ? 1 : 0) +
                      (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0)}
                  </Badge>
                )}
              </Button>

              {/* Sort */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-500 hidden sm:inline">
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {selectedCategories.map((catId) => {
                  const cat = categories.find((c) => c.id === catId);
                  return (
                    <Badge
                      key={catId}
                      variant="secondary"
                      className="gap-1 cursor-pointer hover:bg-gray-200"
                      onClick={() => toggleCategory(catId)}
                    >
                      {cat?.name}
                      <X className="h-3 w-3" />
                    </Badge>
                  );
                })}
                {inStockOnly && (
                  <Badge
                    variant="secondary"
                    className="gap-1 cursor-pointer hover:bg-gray-200"
                    onClick={() => setInStockOnly(false)}
                  >
                    In Stock
                    <X className="h-3 w-3" />
                  </Badge>
                )}
                {/* 
                {minRating > 0 && (
                  <Badge
                    variant="secondary"
                    className="gap-1 cursor-pointer hover:bg-gray-200"
                    onClick={() => setMinRating(0)}
                  >
                    {minRating}+ Stars
                    <X className="h-3 w-3" />
                  </Badge>
                )} */}
                {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                  <Badge
                    variant="secondary"
                    className="gap-1 cursor-pointer hover:bg-gray-200"
                    onClick={() => setPriceRange([0, 10000])}
                  >
                    Price: {priceRange[0]} - {priceRange[1]}
                    <X className="h-3 w-3" />
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  // size="sm"
                  onClick={clearFilters}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 h-6 px-2 text-xs"
                >
                  Clear all
                </Button>
              </div>
            )}

            {/* Product Grid */}
            {loading ? (
              <div className="flex justify-center py-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-xl text-red-600 mb-4">{error}</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setError(null);
                    setPagination(prev => ({ ...prev, page: 1 }));
                  }}
                  className="gap-2"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Retry
                </Button>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {products.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewDetails={(id) => {
                        if (product.slug) {
                          navigate(`/product/${product.slug}`);
                        } else {
                          navigate(`/product/${id}`);
                        }
                      }}
                    />
                  ))}
                </div>
                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      disabled={pagination.page === 1}
                      onClick={() => handlePageChange(pagination.page - 1)}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center px-4 font-medium text-gray-900">
                      Page {pagination.page} of {pagination.pages}
                    </div>
                    <Button
                      variant="outline"
                      disabled={pagination.page === pagination.pages}
                      onClick={() => handlePageChange(pagination.page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-gray-500 mb-4">
                  No products found
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowFilters(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-semibold text-lg text-gray-900">Filters</h2>
                <Button
                  variant="ghost"
                  // size="icon-sm"
                  className="p-1"
                  onClick={() => setShowFilters(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-4">
                <FiltersPanel
                  categories={categories}
                  selectedCategories={selectedCategories}
                  toggleCategory={toggleCategory}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  inStockOnly={inStockOnly}
                  setInStockOnly={setInStockOnly}
                  minRating={minRating}
                  setMinRating={setMinRating}
                  clearFilters={clearFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>
              <div className="sticky bottom-0 p-4 border-t border-gray-200 bg-white">
                <Button
                  // variant="default"
                  className="w-full"
                  onClick={() => setShowFilters(false)}
                >
                  Apply Filters ({pagination.total} results)
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FiltersPanelProps {
  categories: Category[]; // Use our Category type
  selectedCategories: number[]; // Use IDs
  toggleCategory: (id: number) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  inStockOnly: boolean;
  setInStockOnly: (value: boolean) => void;
  minRating: number;
  setMinRating: (value: number) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

function FiltersPanel({
  categories,
  selectedCategories,
  toggleCategory,
  priceRange,
  setPriceRange,
  inStockOnly,
  setInStockOnly,
  minRating,
  setMinRating,
  clearFilters,
  hasActiveFilters,
}: FiltersPanelProps) {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <Card className="p-4 border-gray-200 shadow-sm">
        <h3 className="font-semibold mb-4 text-gray-900">Categories</h3>
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <Checkbox
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
                className="border-gray-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
              />
              <span className="text-sm text-gray-700 group-hover:text-emerald-700 transition-colors flex-1">
                {category.name}
              </span>
              {/* <span className="text-xs text-gray-400">
                {10} 
              </span> */}
            </label>
          ))}
        </div>
      </Card>

      {/* Price Range */}
      <Card className="p-4 border-gray-200 shadow-sm">
        <h3 className="font-semibold mb-6 text-gray-900">Price Range</h3>
        <div className="space-y-6">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={10000}
            step={100}
            className="[&_.bg-primary]:bg-emerald-600 [&_.border-primary]:border-emerald-600"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="bg-gray-100 px-2 py-1 rounded">Rs. {priceRange[0]}</span>
            <span className="bg-gray-100 px-2 py-1 rounded">Rs. {priceRange[1]}</span>
          </div>
        </div>
      </Card>

      {/* Availability */}
      <Card className="p-4 border-gray-200 shadow-sm">
        <h3 className="font-semibold mb-4 text-gray-900">Availability</h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <Checkbox
            checked={inStockOnly}
            // Checkbox onCheckedChange returns boolean | 'indeterminate'
            onCheckedChange={(checked) => setInStockOnly(checked === true)}
            className="border-gray-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
          />
          <span className="text-sm text-gray-700">In Stock Only</span>
        </label>
      </Card>

      {/* Rating - Placeholder for now until backend support*/}
      <Card className="p-4 border-gray-200 shadow-sm opacity-50 pointer-events-none relative">
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">Coming Soon</span>
        </div>
        <h3 className="font-semibold mb-4 text-gray-900">Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <Checkbox
                checked={minRating === rating}
                onCheckedChange={(checked) =>
                  setMinRating(checked ? rating : 0)
                }
                className="border-gray-300"
              />
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">& up</span>
            </label>
          ))}
        </div>
      </Card>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50" onClick={clearFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  );
}
