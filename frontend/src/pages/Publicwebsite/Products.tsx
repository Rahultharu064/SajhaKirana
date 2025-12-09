import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Publicwebsite/Layouts/Header';
import Footer from '../../components/Publicwebsite/Layouts/Footer';
import ProductCard from '../../components/ui/ProductCard'; // Use the UI ProductCard
import { getAllProducts } from '../../services/productService';
import { ChevronRight, Filter } from 'lucide-react';
import Button from '../../components/ui/Button';

// Reuse logic from ProductDetail or create helper
const getProductImage = (product: any) => {
    if (!product.images) return '/api/placeholder/400/400';
    let imgs = product.images;
    if (typeof imgs === 'string') {
        try {
            if (imgs.trim().startsWith('[')) {
                imgs = JSON.parse(imgs);
            } else {
                return imgs.startsWith('/') || imgs.startsWith('http') ? imgs : `/${imgs}`;
            }
        } catch (e) {
            return imgs.startsWith('/') || imgs.startsWith('http') ? imgs : `/${imgs}`;
        }
    }
    if (Array.isArray(imgs) && imgs.length > 0) {
        const img = imgs[0];
        return img.startsWith('/') || img.startsWith('http') ? img : `/${img}`;
    }
    return '/api/placeholder/400/400';
};

const Products = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await getAllProducts({ page: pagination.page, limit: 12 });
                const data = response.data;
                if (data.success) {
                    // Check if backend returns parsed images or strings
                    // The service might already parse, or we verify here. 
                    // ProductDetail check showed it might be mixed.

                    // Map to ProductCard props format
                    const mappedProducts = data.data.map((p: any) => ({
                        id: p.id,
                        title: p.title,
                        price: p.price,
                        mrp: p.mrp,
                        rating: 4.5, // Placeholder if no rating in model
                        image: getProductImage(p), // Helper to get one image
                        discount: p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0,
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
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [pagination.page]);

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= pagination.pages) {
            setPagination(prev => ({ ...prev, page: newPage }));
            window.scrollTo(0, 0);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header />

            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                    <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 font-medium">Products</span>
                </nav>

                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
                        <p className="text-gray-600">Discover our fresh collection</p>
                    </div>
                    {/* Filter Placeholder */}
                    <Button variant="outline" className="hidden gap-2">
                        <Filter className="h-4 w-4" /> Filter
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-32">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mb-12">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onViewDetails={(id) => navigate(`/product/${id}`)}
                                />
                            ))}
                        </div>

                        {products.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                                <p className="text-gray-500 text-lg">No products found.</p>
                            </div>
                        )}

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
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Products;
