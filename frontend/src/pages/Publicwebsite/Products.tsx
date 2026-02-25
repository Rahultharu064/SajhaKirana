import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  SlidersHorizontal,
  X,
  Search,
  ArrowRight,
  Filter,
  Package,
  Star,
} from "lucide-react";
import Header from "../../components/Publicwebsite/Layouts/Header";
import Footer from "../../components/Publicwebsite/Layouts/Footer";
import ProductCard from "../../components/ui/ProductCard";
import { Checkbox } from "../../components/ui/Checkbox";
import { Slider } from "../../components/ui/Slider";
import { getAllProducts } from "../../services/productService";
import { getCategories, type Category } from "../../services/categoryService";

const sortOptions = [
  { value: "popular", label: "Popularity" },
  { value: "priceLow", label: "Price: Low to High" },
  { value: "priceHigh", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
];

const getProductImage = (product: any) => {
  if (!product.images) return 'https://placehold.co/400x400?text=Premium+Item';
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
  return 'https://placehold.co/400x400?text=Premium+Item';
};

export default function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });
  const [showFilters, setShowFilters] = useState(false);

  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);

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
          setError(null);
          const mappedProducts = data.data.map((p: any) => ({
            id: p.id,
            title: p.title,
            price: p.price,
            mrp: p.mrp,
            rating: 4.5,
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
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

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
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      <Header />

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-100/30 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-[30%] left-0 w-[600px] h-[600px] bg-sky-100/30 rounded-full blur-[100px] -z-10" />

      <div className="container-custom py-12">
        {/* Breadcrumb & Title Section */}
        <div className="mb-12">
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 mb-6"
          >
            <Link to="/" className="hover:text-emerald-500 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-slate-900">Collection</span>
          </motion.nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none mb-4 uppercase">
                Premium <br />
                <span className="text-gradient">Collection</span>
              </h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                Found {pagination.total} Selected Masterpieces
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search Selection..."
                  className="h-14 pl-14 pr-6 rounded-2xl bg-white border-2 border-slate-100 focus:border-emerald-500/30 focus:outline-none w-full md:w-80 font-bold text-sm shadow-sm transition-all"
                />
                <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
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
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-10">
              <button
                onClick={() => setShowFilters(true)}
                title="Open Filters"
                aria-label="Open Filters"
                className="lg:hidden h-14 px-8 glass rounded-2xl flex items-center gap-3 font-black text-xs uppercase tracking-widest border-2 border-slate-100 hover:border-emerald-500 transition-all"
              >
                <SlidersHorizontal size={18} />
                Filters
                {hasActiveFilters && <span className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px]">!</span>}
              </button>

              <div className="flex items-center gap-4 ml-auto">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest hidden sm:block">Sort By</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-14 pl-6 pr-12 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 font-black text-sm uppercase tracking-tight appearance-none focus:outline-none focus:ring-0 cursor-pointer shadow-sm w-48 md:w-64"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <ArrowRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="glass-card h-[450px] animate-pulse rounded-[2.5rem]" />
                ))}
              </div>
            ) : error ? (
              <div className="glass rounded-[3rem] p-20 text-center border-white/50 shadow-2xl">
                <div className="w-24 h-24 bg-rose-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-rose-500">
                  <X size={48} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4">{error}</h2>
                <button onClick={() => window.location.reload()} className="btn-premium px-10 py-4">RETRY CONNECTION</button>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid-products">
                  <AnimatePresence mode="popLayout">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onViewDetails={(slug) => navigate(`/product/${slug}`)}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center items-center gap-6 mt-20">
                    <motion.button
                      whileHover={{ x: -5 }}
                      disabled={pagination.page === 1}
                      onClick={() => handlePageChange(pagination.page - 1)}
                      className="w-16 h-16 rounded-2xl glass border-2 border-slate-100 flex items-center justify-center text-slate-700 hover:border-emerald-500 disabled:opacity-30 transition-all shadow-xl"
                    >
                      <ArrowRight className="rotate-180" size={28} />
                    </motion.button>

                    <div className="glass px-10 py-5 rounded-2xl shadow-xl border-2 border-slate-100 font-black text-2xl text-slate-900">
                      {pagination.page} <span className="text-emerald-300 mx-3">/</span> {pagination.pages}
                    </div>

                    <motion.button
                      whileHover={{ x: 5 }}
                      disabled={pagination.page === pagination.pages}
                      onClick={() => handlePageChange(pagination.page + 1)}
                      className="w-16 h-16 rounded-2xl glass border-2 border-slate-100 flex items-center justify-center text-slate-700 hover:border-emerald-500 disabled:opacity-30 transition-all shadow-xl"
                    >
                      <ArrowRight size={28} />
                    </motion.button>
                  </div>
                )}
              </>
            ) : (
              <div className="glass rounded-[3rem] p-20 text-center border-white/50 shadow-2xl">
                <div className="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-slate-400">
                  <Package size={48} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Selection Is Empty</h2>
                <p className="text-slate-500 font-medium mb-10">Try adjusting your filters to find what you're looking for.</p>
                <button onClick={clearFilters} className="btn-premium px-12 py-5">CLEAR ALL FILTERS</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* Mobile Drawer */}
      <AnimatePresence>
        {showFilters && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-[400px] max-w-full bg-slate-50 shadow-3xl overflow-y-auto p-8"
            >
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black uppercase tracking-widest text-slate-900">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  title="Close Filters"
                  aria-label="Close Filters"
                  className="w-12 h-12 glass rounded-2xl flex items-center justify-center"
                >
                  <X size={24} />
                </button>
              </div>
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FiltersPanelProps {
  categories: Category[];
  selectedCategories: number[];
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
    <div className="space-y-10">
      {/* Categories */}
      <div className="glass p-8 rounded-[2.5rem] border-white/50 shadow-xl">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
          <Filter size={14} className="text-emerald-500" /> Categories
        </h3>
        <div className="space-y-4 max-h-80 overflow-y-auto pr-4 custom-scrollbar">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center gap-4 cursor-pointer group">
              <Checkbox
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
                className="w-6 h-6 rounded-lg border-2 border-slate-200 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
              />
              <span className="text-sm font-black text-slate-700 uppercase tracking-tight group-hover:text-emerald-600 transition-colors flex-1">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="glass p-8 rounded-[2.5rem] border-white/50 shadow-xl">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-10 flex items-center gap-2">
          <Package size={14} className="text-emerald-500" /> Value Range
        </h3>
        <div className="space-y-8">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={10000}
            step={100}
            className="[&_.bg-primary]:bg-emerald-600 [&_.border-primary]:border-emerald-600"
          />
          <div className="flex items-center justify-between font-black text-sm text-slate-800 tracking-tighter">
            <span className="px-4 py-2 bg-emerald-50 rounded-xl text-emerald-700">Rs. {priceRange[0]}</span>
            <span className="px-4 py-2 bg-emerald-50 rounded-xl text-emerald-700">Rs. {priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="glass p-8 rounded-[2.5rem] border-white/50 shadow-xl">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
          <Star size={14} className="text-emerald-500" /> Availability
        </h3>
        <label className="flex items-center gap-4 cursor-pointer">
          <Checkbox
            checked={inStockOnly}
            onCheckedChange={(checked) => setInStockOnly(checked === true)}
            className="w-6 h-6 rounded-lg border-2 border-slate-200 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
          />
          <span className="text-sm font-black text-slate-700 uppercase tracking-tight">Only Ready Selection</span>
        </label>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full h-16 rounded-[2rem] bg-rose-50 text-rose-600 font-black text-xs uppercase tracking-widest hover:bg-rose-100 transition-all border border-rose-100"
        >
          Reset Selection
        </button>
      )}
    </div>
  );
}
