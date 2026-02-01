import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, X } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import { wishlistService, type WishlistItem } from '../../services/wishlistService';
import type { RootState } from '../../Redux/store';
import toast from 'react-hot-toast';

const Wishlist = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState<number | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login?redirect=/wishlist');
            return;
        }

        fetchWishlist();
    }, [isAuthenticated, navigate]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const response = await wishlistService.getWishlist();
            if (response.success) {
                setWishlist(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch wishlist:', error);
            toast.error('Failed to load wishlist');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId: number) => {
        try {
            setRemovingId(productId);
            await wishlistService.removeFromWishlist(productId);
            setWishlist(prev => prev.filter(item => item.productId !== productId));
            toast.success('Removed from wishlist');
        } catch (error) {
            console.error('Failed to remove from wishlist:', error);
            toast.error('Failed to remove item');
        } finally {
            setRemovingId(null);
        }
    };

    const getImageUrl = (images: string) => {
        try {
            const parsed = JSON.parse(images);
            const firstImage = Array.isArray(parsed) ? parsed[0] : images;
            return firstImage?.startsWith('/') || firstImage?.startsWith('http')
                ? firstImage
                : `/${firstImage}`;
        } catch {
            return images?.startsWith('/') || images?.startsWith('http')
                ? images
                : `/${images}`;
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Heart className="w-8 h-8 text-red-500 fill-current" />
                            My Wishlist
                        </h1>
                        <Button variant="outline" onClick={() => navigate('/products')}>
                            Continue Shopping
                        </Button>
                    </div>

                    {wishlist.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center"
                        >
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart className="w-10 h-10 text-gray-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
                            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                                Save items you love to your wishlist and shop them later!
                            </p>
                            <Button onClick={() => navigate('/products')} size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                Start Shopping
                            </Button>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <AnimatePresence>
                                {wishlist.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="relative aspect-square bg-gray-50 overflow-hidden">
                                            <img
                                                src={getImageUrl(item.product.images)}
                                                alt={item.product.title}
                                                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <button
                                                onClick={() => handleRemove(item.productId)}
                                                disabled={removingId === item.productId}
                                                className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-all"
                                            >
                                                {removingId === item.productId ? (
                                                    <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <X className="w-5 h-5" />
                                                )}
                                            </button>
                                            {item.product.stock <= 0 && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                                                        Out of Stock
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4">
                                            <div className="mb-2">
                                                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                                    {item.product.category.name}
                                                </span>
                                            </div>
                                            <h3
                                                className="font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-emerald-600 transition-colors"
                                                onClick={() => navigate(`/product/${item.product.slug}`)}
                                            >
                                                {item.product.title}
                                            </h3>
                                            <div className="flex items-end gap-2 mb-4">
                                                <span className="text-2xl font-bold text-gray-900">
                                                    Rs. {item.product.price.toLocaleString()}
                                                </span>
                                                {item.product.mrp > item.product.price && (
                                                    <span className="text-sm text-gray-400 line-through mb-1">
                                                        Rs. {item.product.mrp.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="primary"
                                                    className="flex-1 h-10 text-sm"
                                                    onClick={() => navigate(`/product/${item.product.slug}`)}
                                                >
                                                    <ShoppingCart className="w-4 h-4 mr-1" />
                                                    View
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="h-10 px-3 border-red-200 hover:bg-red-50 hover:border-red-300"
                                                    onClick={() => handleRemove(item.productId)}
                                                    disabled={removingId === item.productId}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Wishlist;
