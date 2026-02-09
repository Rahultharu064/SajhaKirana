import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    Zap,
    Timer,
    ShoppingBag,
    ArrowRight,
    Percent,
    TrendingDown,
    Clock,
    Filter,
    CheckCircle2
} from "lucide-react";
import Header from "../../components/Publicwebsite/Layouts/Header";
import Footer from "../../components/Publicwebsite/Layouts/Footer";
import ProductCard from "../../components/ui/ProductCard";
import { getDeals } from "../../services/productService";
import toast from "react-hot-toast";

export default function DealsPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });
    const [sortBy, setSortBy] = useState("discount");

    useEffect(() => {
        const fetchDeals = async () => {
            setLoading(true);
            try {
                const response = await getDeals({
                    page: pagination.page,
                    limit: 12,
                    sort: sortBy
                });

                if (response.data.success) {
                    const mappedProducts = response.data.data.map((p: any) => ({
                        id: p.id,
                        title: p.title,
                        price: p.price,
                        mrp: p.mrp,
                        rating: 4.5,
                        image: p.images?.[0] || '/api/placeholder/400/400',
                        sku: p.sku,
                        discount: p.discount,
                        slug: p.slug
                    }));
                    setProducts(mappedProducts);
                    setPagination(prev => ({
                        ...prev,
                        total: response.data.pagination.total,
                        pages: response.data.pagination.pages
                    }));
                }
            } catch (err) {
                console.error('Failed to fetch deals:', err);
                toast.error('Failed to load amazing deals. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchDeals();
    }, [pagination.page, sortBy]);

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= pagination.pages) {
            setPagination(prev => ({ ...prev, page: newPage }));
            window.scrollTo(0, 0);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-12 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500 via-pink-600 to-rose-700"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                {/* Animated Orbs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-rose-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="container-custom relative z-10">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white font-bold text-sm tracking-wide">
                                <Zap size={16} className="text-yellow-300 fill-yellow-300 animate-pulse" />
                                <span>FLASH DEALS - UP TO 70% OFF</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
                                Super <span className="text-yellow-300 italic">Savings</span> <br />
                                Every Single Day
                            </h1>

                            <p className="text-xl text-white/90 max-w-xl font-medium leading-relaxed">
                                Grab your favorites at unbeatable prices. From fresh fruits to daily essentials, we've got the best bargains in town.
                            </p>

                            <div className="flex flex-wrap items-center gap-6 pt-4">
                                <div className="flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                                    <Timer className="text-yellow-300 animate-spin-slow" />
                                    <div>
                                        <p className="text-white font-bold">Limited Time</p>
                                        <p className="text-rose-100 text-xs uppercase tracking-widest">Offers end soon</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                                    <CheckCircle2 className="text-emerald-400" />
                                    <div>
                                        <p className="text-white font-bold">Guaranteed</p>
                                        <p className="text-rose-100 text-xs uppercase tracking-widest">Fresh & Quality</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Floating Badges Visualization */}
                <div className="absolute bottom-0 right-0 w-1/3 h-full hidden lg:flex items-center justify-center">
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="relative"
                    >
                        <div className="w-64 h-64 bg-yellow-400 rounded-full flex flex-col items-center justify-center shadow-2xl border-[12px] border-white/20">
                            <span className="text-7xl font-black text-rose-600 -rotate-12">DEALS</span>
                            <span className="text-2xl font-bold text-rose-800 rotate-6 uppercase tracking-tighter">Day & Night</span>
                        </div>
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center border-8 border-white shadow-xl"
                        >
                            <span className="text-2xl font-black text-white">SAVE!</span>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <div className="container-custom -mt-10 relative z-20 pb-20">
                {/* Toolbar & Filters */}
                <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 mb-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                <Filter className="text-white" size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Current Deals</h2>
                                <p className="text-slate-500 text-sm font-medium">{pagination.total} products on offer</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <label className="text-sm font-bold text-slate-500 hidden sm:block uppercase tracking-wider">Sort by:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                title="Sort items"
                                aria-label="Sort items"
                                className="flex-1 md:flex-none h-12 pl-4 pr-10 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-700 font-bold focus:border-rose-300 focus:outline-none transition-colors appearance-none cursor-pointer custom-select-arrow"
                            >
                                <option value="discount">Highest Discount</option>
                                <option value="priceLow">Lowest Price</option>
                                <option value="popular">Most Popular</option>
                                <option value="newest">Just Added</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-[2.5rem] p-4 h-[400px] animate-pulse border border-slate-100">
                                <div className="w-full h-48 bg-slate-100 rounded-3xl mb-4"></div>
                                <div className="h-6 bg-slate-100 rounded-full w-3/4 mb-3"></div>
                                <div className="h-4 bg-slate-100 rounded-full w-1/2 mb-6"></div>
                                <div className="h-12 bg-slate-100 rounded-2xl w-full mt-auto"></div>
                            </div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            <AnimatePresence mode="popLayout">
                                {products.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                        className="relative group"
                                    >
                                        {/* Hot Badge Wrapper for enhanced card look */}
                                        <div className="absolute -top-4 -left-4 z-20 pointer-events-none group-hover:scale-110 transition-transform">
                                            <div className="bg-gradient-to-r from-rose-600 to-pink-500 text-white font-black px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2">
                                                <Percent size={14} />
                                                <span>-{product.discount}%</span>
                                            </div>
                                        </div>

                                        <ProductCard
                                            product={product}
                                            onViewDetails={(id) => {
                                                if (product.slug) {
                                                    navigate(`/product/${product.slug}`);
                                                } else {
                                                    navigate(`/product/${id}`);
                                                }
                                            }}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Pagination Controls */}
                        {pagination.pages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-16">
                                <button
                                    disabled={pagination.page === 1}
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    title="Previous Page"
                                    aria-label="Previous Page"
                                    className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center text-slate-700 hover:border-rose-500 hover:text-rose-500 disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-700 transition-all shadow-lg"
                                >
                                    <ArrowRight className="rotate-180" size={24} />
                                </button>

                                <div className="bg-white px-8 py-4 rounded-2xl shadow-lg border-2 border-slate-200 font-black text-xl text-slate-800">
                                    {pagination.page} <span className="text-slate-300 mx-2">/</span> {pagination.pages}
                                </div>

                                <button
                                    disabled={pagination.page === pagination.pages}
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    title="Next Page"
                                    aria-label="Next Page"
                                    className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center text-slate-700 hover:border-rose-500 hover:text-rose-500 disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-700 transition-all shadow-lg"
                                >
                                    <ArrowRight size={24} />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-white rounded-[3rem] p-20 text-center shadow-xl border border-slate-100">
                        <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <ShoppingBag size={48} className="text-slate-300" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">No deals found for your search</h2>
                        <p className="text-slate-500 max-w-md mx-auto mb-10">We're constantly updating our prices. Check back soon for exciting new offers!</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors shadow-xl"
                        >
                            Explore All Products
                        </button>
                    </div>
                )}

                {/* Deal Features / Why deals? */}
                <section className="mt-32">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="space-y-4 text-center p-8 bg-white/50 backdrop-blur-md rounded-3xl border border-white">
                            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg text-white">
                                <TrendingDown size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Lowest Prices</h3>
                            <p className="text-slate-600 leading-relaxed">We negotiate with suppliers to bring you the best value for your hard-earned money.</p>
                        </div>
                        <div className="space-y-4 text-center p-8 bg-white/50 backdrop-blur-md rounded-3xl border border-white">
                            <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg text-white">
                                <Clock size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Daily Updates</h3>
                            <p className="text-slate-600 leading-relaxed">Our deals are updated at midnight every day. Don't miss out on limited availability items!</p>
                        </div>
                        <div className="space-y-4 text-center p-8 bg-white/50 backdrop-blur-md rounded-3xl border border-white">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg text-white">
                                <Sparkles size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Exclusive Offers</h3>
                            <p className="text-slate-600 leading-relaxed">Special bundle deals and combo offers available only on our mobile app and website.</p>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />

            <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
        </div>
    );
}
