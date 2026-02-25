import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Publicwebsite/Layouts/Header';
import Footer from '../../components/Publicwebsite/Layouts/Footer';
import ProductCard from '../../components/ui/ProductCard';
import { getCategoryBySlug } from '../../services/categoryService';
import { getProductsByCategory } from '../../services/productService';

interface Product {
  id: number;
  title: string;
  price: number;
  mrp: number;
  sku: string;
  slug: string;
  images: string[];
}

const CategoryProducts = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>('');

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      if (!slug) return;

      setLoading(true);
      try {
        // 1. Get Category ID from Slug
        const category = await getCategoryBySlug(slug);

        if (!category) {
          setError('Category not found');
          setLoading(false);
          return;
        }

        setCategoryName(category.name);

        // 2. Fetch Products using Category ID
        const response = await getProductsByCategory(category.id, { limit: 50 });
        const productsData = response.data?.data || response.data;
        setProducts(productsData);

      } catch (err) {
        console.error('Failed to fetch category data:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [slug]);

  // Map backend product data to ProductCard format
  const mapProductsToCardFormat = (products: Product[]) => {
    return products.map(product => {
      // Handle image URLs - use relative path for proxy
      let imageUrl = '/api/placeholder/300/200';
      if (product.images && product.images.length > 0) {
        imageUrl = product.images[0]; // Backend returns full paths like /uploads/products/filename.jpg
      }
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        mrp: product.mrp,
        rating: 4.5, // Default rating
        image: imageUrl,
        sku: product.sku,
        slug: product.slug,
        discount: product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0,
      };
    });
  };

  const handleViewDetails = (productId: number) => {
    // Find product by ID to get its slug
    const product = products.find(p => p.id === productId);
    if (product?.slug) {
      navigate(`/product/${product.slug}`);
    } else {
      // Fallback to ID if slug is not available
      navigate(`/product/${productId}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-3xl opacity-50 -z-10"></div>
        <div className="container-custom">
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
              {categoryName ? <span className="text-gradient">{categoryName}</span> : 'Collection'}
            </h1>
            <p className="text-slate-500 font-medium text-lg max-w-xl mx-auto">
              Explore our handpicked selection of premium {categoryName?.toLowerCase() || 'grocery'} items.
            </p>
          </div>

          {loading ? (
            <div className="grid-products">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="glass-card rounded-[2.5rem] h-[400px] animate-pulse bg-white/50" />
              ))}
            </div>
          ) : error ? (
            <div className="glass rounded-[3rem] p-16 text-center border-slate-100 shadow-xl max-w-2xl mx-auto mt-12">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex-center mx-auto mb-6 font-black text-2xl">!</div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Something went wrong</h2>
              <p className="text-slate-500 mb-8">{error}</p>
              <button onClick={() => window.location.reload()} className="btn-premium px-8 py-3">Try Again</button>
            </div>
          ) : products.length > 0 ? (
            <div className="grid-products">
              {mapProductsToCardFormat(products).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={(slugOrId) => navigate(`/product/${slugOrId}`)}
                />
              ))}
            </div>
          ) : (
            <div className="glass rounded-[3rem] p-16 text-center border-slate-100 shadow-xl max-w-2xl mx-auto mt-12">
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex-center mx-auto mb-6">?</div>
              <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Empty Collection</h2>
              <p className="text-slate-500 mb-8">We haven't added any products to this category yet. Check back soon!</p>
              <button onClick={() => navigate('/products')} className="btn-premium px-8 py-3 text-sm">View All Products</button>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CategoryProducts;
