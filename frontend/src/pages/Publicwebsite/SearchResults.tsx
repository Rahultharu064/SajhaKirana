import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchService } from '../../services/searchService';
import { Loader2, Search as SearchIcon, Sparkles, TrendingUp } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../Redux/store';
import Header from '../../components/Publicwebsite/Layouts/Header';
import Footer from '../../components/Publicwebsite/Layouts/Footer';

interface SearchResult {
  productId: number;
  title: string;
  price: number;
  mrp: number;
  image: string | null;
  avgRating: number;
  stock: number;
  score: number;
  relevanceScore: number;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const performSearch = async () => {
      if (!query) return;

      setLoading(true);
      try {
        const response = await searchService.search(query, {
          userId: user?.userId,
          limit: 20
        });

        if (response.data.success) {
          setResults(response.data.data);
        }
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query, user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Sparkles className="h-6 w-6 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Search Results
            </h1>
          </div>
          <p className="text-gray-600 flex items-center">
            <SearchIcon className="h-4 w-4 mr-2" />
            Showing results for: <span className="font-semibold ml-2 text-emerald-700">"{query}"</span>
          </p>
          {results.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Found {results.length} products ranked by relevance, popularity, and availability
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-emerald-600 animate-spin mb-4" />
            <p className="text-gray-600">Searching with AI...</p>
          </div>
        )}

        {/* Results Grid */}
        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((product) => (
              <Link
                key={product.productId}
                to={`/products/${product.productId}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}

                  {/* Relevance Badge */}
                  {product.score > 0.8 && (
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Top Match
                    </div>
                  )}

                  {/* Stock Badge */}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-bold">Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {product.title}
                  </h3>

                  {/* Rating */}
                  {product.avgRating > 0 && (
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>
                            {i < Math.floor(product.avgRating) ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-2">
                        ({product.avgRating.toFixed(1)})
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-emerald-600">
                      Rs. {product.price}
                    </span>
                    {product.mrp > product.price && (
                      <>
                        <span className="text-sm text-gray-400 line-through">
                          Rs. {product.mrp}
                        </span>
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold">
                          {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  {/* Relevance Score (Debug) */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="mt-2 text-xs text-gray-400">
                      Score: {product.score.toFixed(2)} | Relevance: {product.relevanceScore.toFixed(2)}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && results.length === 0 && query && (
          <div className="text-center py-20">
            <SearchIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No results found</h2>
            <p className="text-gray-500 mb-6">
              We couldn't find any products matching "{query}"
            </p>
            <Link
              to="/products"
              className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SearchResults;
