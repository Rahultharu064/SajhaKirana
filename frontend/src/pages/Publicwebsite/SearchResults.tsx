// Enhanced Search Results Page with Voice Search, Image Search, and Autocomplete
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  SlidersHorizontal,
  X,
  Search,
  Mic,
  MicOff,
  Image as ImageIcon,
  Clock,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";
import Header from "../../components/Publicwebsite/Layouts/Header";
import Footer from "../../components/Publicwebsite/Layouts/Footer";
import ProductCard from "../../components/ui/ProductCard";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { Checkbox } from "../../components/ui/Checkbox";

import { searchProducts, getAutocompleteSuggestions, searchByImage } from "../../services/productService";
import { getCategories, searchCategories, type Category } from "../../services/categoryService";

interface AutocompleteSuggestion {
  type: 'product' | 'category';
  id: number;
  text: string;
  category?: string;
  url: string;
}

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "priceLow", label: "Price: Low to High" },
  { value: "priceHigh", label: "Price: High to Low" },
  { value: "popular", label: "Popularity" },
];

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

export default function SearchResultsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });
  const [showFilters, setShowFilters] = useState(false);

  // Enhanced Search States
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [searchInputRef, setSearchInputRef] = useState<HTMLInputElement | null>(null);

  // Search and Filter States
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [priceMin, setPriceMin] = useState<number>(
    parseInt(searchParams.get('priceMin') || '0') || 0
  );
  const [priceMax, setPriceMax] = useState<number>(
    parseInt(searchParams.get('priceMax') || '10000') || 10000
  );
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    searchParams.get('category')?.split(',').map(Number).filter(Boolean) || []
  );
  const [page, setPage] = useState(1);

  // Voice Search, Autocomplete, and Image Search Functions
  const handleVoiceSearch = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice search not supported in this browser. Try Chrome, Safari, or Edge.');
      return;
    }

    try {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        toast.loading('Listening for your search query...', { id: 'voice-search' });
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
        toast.success(`Searching for: "${transcript}"`, { id: 'voice-search' });
        handleNewSearch(transcript);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        toast.error('Voice search failed. Please try again.', { id: 'voice-search' });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (error) {
      toast.error('Voice search failed. Please try again.');
    }
  }, []);

  const handleImageSearch = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Please select an image smaller than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    setLoading(true);
    try {
      toast.loading('Analyzing your image...', { id: 'image-search' });
      const response = await searchByImage(file);

      if (response.data.success) {
        const mappedProducts = response.data.data.map((p: any) => ({
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
          page: response.data.pagination.page,
          total: response.data.pagination.total,
          pages: response.data.pagination.pages
        });
        toast.success(`Found ${mappedProducts.length} similar products!`, { id: 'image-search' });
      }
    } catch (error) {
      console.error('Image search error:', error);
      toast.error('Image search failed. Please try again.', { id: 'image-search' });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSuggestionClick = useCallback((suggestion: AutocompleteSuggestion) => {
    setShowSuggestions(false);
    if (suggestion.type === 'product') {
      navigate(suggestion.url);
    } else {
      handleNewSearch(suggestion.text);
    }
  }, [navigate]);

  // Fetch autocomplete suggestions with debouncing
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const response = await getAutocompleteSuggestions(query);
        if (response.data.success) {
          setSuggestions(response.data.data);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestions([]);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef && !searchInputRef.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchInputRef]);

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

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (priceMin > 0) params.set('priceMin', priceMin.toString());
    if (priceMax < 10000) params.set('priceMax', priceMax.toString());
    if (selectedCategories.length > 0) params.set('category', selectedCategories.join(','));
    if (page > 1) params.set('page', page.toString());

    setSearchParams(params);
  }, [query, sortBy, priceMin, priceMax, selectedCategories, page, setSearchParams]);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      if (!query.trim()) return;

      setLoading(true);
      try {
        // Also search for categories by name to include those products
        let categoryIds = selectedCategories.length > 0 ? [...selectedCategories] : [];

        try {
          const categoryResults = await searchCategories(query.trim());
          const matchingCategoryIds = categoryResults.map((cat: Category) => cat.id);
          categoryIds = [...new Set([...categoryIds, ...matchingCategoryIds])];
        } catch (categoryError) {
          // If category search fails, continue without it
          console.warn('Failed to search categories:', categoryError);
        }

        const response = await searchProducts({
          q: query.trim(),
          category: categoryIds.length > 0 ? categoryIds : undefined,
          priceMin: priceMin > 0 ? priceMin : undefined,
          priceMax: priceMax < 10000 ? priceMax : undefined,
          sort: sortBy as any,
          page: page,
          limit: 12,
        });

        const data = response.data;
        if (data.success) {
          setError(null);
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
        console.error('Failed to fetch search results:', err);
        setError('Failed to load search results. Please try again later.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, selectedCategories, priceMin, priceMax, sortBy, page]);

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceMin(0);
    setPriceMax(10000);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      setPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    priceMin > 0 ||
    priceMax < 10000;

  const handleNewSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

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
          <span className="text-gray-900">Search Results</span>
        </nav>

        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Search className="h-6 w-6 text-emerald-600" />
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
              Search Results
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <p className="text-gray-600">
              <span className="font-medium">"{query}"</span>
              {pagination.total > 0 && (
                <span> - {pagination.total} product{pagination.total !== 1 ? 's' : ''} found</span>
              )}
            </p>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-500">New search:</span>
              <div className="relative">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <input
                    ref={(el) => setSearchInputRef(el)}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(query.length >= 2)}
                    onKeyPress={(e) => e.key === 'Enter' && handleNewSearch(query)}
                    placeholder="Search products..."
                    className="flex-1 px-3 py-2 focus:outline-none rounded-l-lg"
                  />

                  {/* Voice Search Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleVoiceSearch}
                    className={`px-3 py-2 hover:bg-gray-50 ${isListening ? 'text-red-500' : 'text-gray-600'}`}
                    title="Voice search"
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>

                  {/* Image Search Button */}
                  <label className="cursor-pointer px-3 py-2 hover:bg-gray-50 rounded-r-lg" title="Search by image">
                    <ImageIcon className="h-4 w-4 text-gray-600" />
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageSearch}
                      className="hidden"
                      aria-label="Search by image"
                    />
                  </label>
                </div>

                {/* Autocomplete Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 max-h-80 overflow-y-auto"
                  >
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={`${suggestion.type}-${suggestion.id}`}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion.type === 'product' ? (
                          <Tag className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 truncate">
                            {suggestion.text}
                          </div>
                          {suggestion.category && (
                            <div className="text-xs text-gray-500 truncate">
                              in {suggestion.category}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
              <Button
                size="sm"
                onClick={() => handleNewSearch(query)}
                className="px-3 py-2"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {!query.trim() ? (
          <div className="text-center py-16">
            <Search className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              What are you looking for?
            </h2>
            <p className="text-gray-500 mb-6">
              Use voice search, upload an image, or type to find products
            </p>
            <div className="flex justify-center">
              <div className="flex gap-2 max-w-md w-full">
                <div className="relative flex-1">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <input
                      ref={(el) => setSearchInputRef(el)}
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => setShowSuggestions(query.length >= 2)}
                      onKeyPress={(e) => e.key === 'Enter' && handleNewSearch(query)}
                      placeholder="Search for products..."
                      className="flex-1 px-3 py-2 focus:outline-none rounded-l-lg"
                    />

                    {/* Voice Search Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleVoiceSearch}
                      className={`px-3 py-2 hover:bg-gray-50 ${isListening ? 'text-red-500' : 'text-gray-600'}`}
                      title="Voice search"
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>

                    {/* Image Search Button */}
                    <label className="cursor-pointer px-3 py-2 hover:bg-gray-50 rounded-r-lg" title="Search by image">
                      <ImageIcon className="h-4 w-4 text-gray-600" />
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageSearch}
                        className="hidden"
                        aria-label="Search by image"
                      />
                    </label>
                  </div>

                  {/* Autocomplete Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 max-h-80 overflow-y-auto"
                    >
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={`${suggestion.type}-${suggestion.id}`}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion.type === 'product' ? (
                            <Tag className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-gray-900 truncate">
                              {suggestion.text}
                            </div>
                            {suggestion.category && (
                              <div className="text-xs text-gray-500 truncate">
                                in {suggestion.category}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
                <Button onClick={() => handleNewSearch(query)}>
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-8">
            {/* Filters Sidebar - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <FiltersPanel
                categories={categories}
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
                priceMin={priceMin}
                priceMax={priceMax}
                setPriceMin={setPriceMin}
                setPriceMax={setPriceMax}
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
                  className="lg:hidden gap-2"
                  onClick={() => setShowFilters(true)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {hasActiveFilters && (
                    <Badge variant="primary" className="ml-1 px-1.5 py-0.5 h-auto text-xs">
                      {selectedCategories.length +
                        (priceMin > 0 || priceMax < 10000 ? 1 : 0)}
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
                    className="h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    title="Sort products by"
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
                  {(priceMin > 0 || priceMax < 10000) && (
                    <Badge
                      variant="secondary"
                      className="gap-1 cursor-pointer hover:bg-gray-200"
                      onClick={() => {
                        setPriceMin(0);
                        setPriceMax(10000);
                      }}
                    >
                      Price: ₹{priceMin} - ₹{priceMax}
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
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
                  <p className="text-xl text-red-600 mb-4">{error}</p>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product, _index) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onViewDetails={(_id) => {
                          if (product.slug) {
                            navigate(`/product/${product.slug}`);
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
                  <Search className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    No products found
                  </h2>
                  <p className="text-gray-500 mb-6">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/')}>
                      Browse All Products
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
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
                  priceMin={priceMin}
                  priceMax={priceMax}
                  setPriceMin={setPriceMin}
                  setPriceMax={setPriceMax}
                  clearFilters={clearFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>
              <div className="sticky bottom-0 p-4 border-t border-gray-200 bg-white">
                <Button
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
  categories: Category[];
  selectedCategories: number[];
  toggleCategory: (id: number) => void;
  priceMin: number;
  priceMax: number;
  setPriceMin: (value: number) => void;
  setPriceMax: (value: number) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

function FiltersPanel({
  categories,
  selectedCategories,
  toggleCategory,
  priceMin,
  priceMax,
  setPriceMin,
  setPriceMax,
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
            </label>
          ))}
        </div>
      </Card>

      {/* Price Range */}
      <Card className="p-4 border-gray-200 shadow-sm">
        <h3 className="font-semibold mb-6 text-gray-900">Price Range</h3>
        <div className="space-y-6">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceMin || ''}
              onChange={(e) => setPriceMin(parseInt(e.target.value) || 0)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={priceMax === 10000 ? '' : priceMax}
              onChange={(e) => setPriceMax(parseInt(e.target.value) || 10000)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
          <div className="text-xs text-gray-500">
            Use the inputs above to set precise price range
          </div>
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
