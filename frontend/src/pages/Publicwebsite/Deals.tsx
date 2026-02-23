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
    CheckCircle2,
    Star
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
                        image: p.images?.[0] || 'https://placehold.co/400x400?text=Premium+Deal',
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
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            <Header />

            {/* Background Orbs */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-100/30 rounded-full blur-[120px] -z-10" />
            <div className="absolute top-[40%] left-0 w-[600px] h-[600px] bg-sky-100/30 rounded-full blur-[100px] -z-10" />

            {/* Hero Section */}
            <section className="relative pt-24 pb-32">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 text-rose-700 text-xs font-black uppercase tracking-widest border border-rose-200 shadow-sm">
                                <Zap size={14} className="fill-current animate-pulse" />
                                <span>Flash Savings Live</span>
                            </div>

                            <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter">
                                Pure <span className="text-gradient">Savings.</span> <br />
                                Fresh <span className="italic font-serif">Deals.</span>
                            </h1>

                            <p className="text-xl text-slate-600 font-medium max-w-xl leading-relaxed">
                                Curated premium selections at unbeatable values. Farm-fresh organic produce and essentials, priced to make you smile.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <div className="glass px-6 py-4 rounded-[2rem] flex items-center gap-4 border-rose-100">
                                    <div className="bg-rose-100 p-3 rounded-2xl text-rose-600">
                                        <Timer size={24} className="animate-spin-slow" />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 leading-tight">Ends Soon</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-rose-500">Only 24 Hours Left</p>
                                    </div>
                                </div>
                                <div className="glass px-6 py-4 rounded-[2rem] flex items-center gap-4">
                                    <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 leading-tight">Guaranteed</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Premium Quality</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <div className="relative hidden lg:block">
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="relative z-10"
                            >
                                <div className="w-[450px] h-[450px] bg-brand-gradient rounded-[4rem] flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <Percent size={120} className="text-white/20 absolute -top-10 -right-10 rotate-12" />
                                    <h2 className="text-[140px] font-black text-white leading-none tracking-tighter -rotate-6">70%</h2>
                                    <p className="text-2xl font-black text-white/80 uppercase tracking-[0.2em] -mt-4 rotate-6">OFF</p>
                                </div>

                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="absolute -bottom-10 -left-10 glass p-8 rounded-[3rem] shadow-2xl border-emerald-200"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="bg-emerald-500 p-4 rounded-2xl text-white">
                                            <Sparkles size={32} />
                                        </div>
                                        <div>
                                            <p className="text-3xl font-black text-slate-900">SAVE.</p>
                                            <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Live Better</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container-custom -mt-16 relative z-20 pb-32">
                {/* Filters */}
                <div className="glass rounded-[3rem] p-8 shadow-2xl border-white/50 mb-16 backdrop-blur-2xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-brand-gradient flex items-center justify-center shadow-lg">
                                <Filter className="text-white" size={28} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Active Offers</h2>
                                <p className="text-emerald-600 text-sm font-black uppercase tracking-widest">{pagination.total} Selected Items</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest hidden sm:block">Sort By</span>
                            <div className="relative flex-1 md:w-64">
                                <select
                                    aria-label="Sort Deals"
                                    title="Sort Deals"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="h-14 pl-6 pr-12 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 font-black text-sm uppercase tracking-tight appearance-none focus:outline-none focus:ring-0 cursor-pointer shadow-sm w-48 md:w-64"
                                >
                                    <option value="discount">Highest Savings</option>
                                    <option value="priceLow">Value Price</option>
                                    <option value="popular">Most Loved</option>
                                    <option value="newest">Fresh Deals</option>
                                </select>
                                <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400" size={18} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="glass-card rounded-[2.5rem] p-4 h-[500px] animate-pulse" />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
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
                                    className="w-16 h-16 rounded-2xl glass border-2 border-slate-100 flex items-center justify-center text-slate-700 hover:border-emerald-500 hover:text-emerald-500 disabled:opacity-30 disabled:hover:border-slate-100 transition-all shadow-xl"
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
                                    className="w-16 h-16 rounded-2xl glass border-2 border-slate-100 flex items-center justify-center text-slate-700 hover:border-emerald-500 hover:text-emerald-500 disabled:opacity-30 disabled:hover:border-slate-100 transition-all shadow-xl"
                                >
                                    <ArrowRight size={28} />
                                </motion.button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="glass rounded-[4rem] p-24 text-center border-white/50 shadow-2xl">
                        <div className="w-32 h-32 bg-slate-50/50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-slate-100">
                            <ShoppingBag size={48} className="text-slate-300" />
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 mb-4">NO DEALS FOUND</h2>
                        <p className="text-slate-500 max-w-md mx-auto mb-10 font-medium">We're updating our organic selection. Check back in a few hours for fresh surprises!</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="btn-premium px-12 py-5"
                        >
                            EXPLORE ALL PRODUCTS
                        </button>
                    </div>
                )}

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-32">
                    {[
                        { icon: TrendingDown, title: "MAX VALUE", desc: "Premium quality at the best possible price points.", color: "rose" },
                        { icon: Clock, title: "DAILY FRESH", desc: "Deals refreshed every midnight. Grab them early.", color: "amber" },
                        { icon: Star, title: "HAND PICKED", desc: "Each item quality-checked by our farm experts.", color: "emerald" },
                    ].map((feature, i) => (
                        <div key={i} className="glass p-10 rounded-[3rem] text-center space-y-6 hover:shadow-2xl transition-all border-white/50 group">
                            <div className={`w-20 h-20 bg-${feature.color}-100 rounded-[1.5rem] flex items-center justify-center mx-auto transition-transform group-hover:scale-110 group-hover:rotate-6 text-${feature.color}-600`}>
                                <feature.icon size={36} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">{feature.title}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />

            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 12s linear infinite;
                }
            `}</style>
        </div>
    );
}
