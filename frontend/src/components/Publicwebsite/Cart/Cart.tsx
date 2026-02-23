import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, removeFromCart } from '../../../Redux/slices/cartSlice';
import type { RootState, AppDispatch } from '../../../Redux/store';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Truck, RotateCcw, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Layout from '../../layout/Layout';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, total } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [user, dispatch]);

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      await dispatch(removeFromCart(cartItemId));
      toast.success('Selection removed from cart');
    } catch (error) {
      toast.error('Could not remove selection');
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center p-6">
          <div className="glass p-16 rounded-[4rem] text-center max-w-lg border-white/50 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <ShoppingBag size={200} />
            </div>
            <div className="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-slate-400">
              <ShoppingBag size={48} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Your Bag Is Locked</h2>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed">
              Sign in to access your saved premium selection and continue your shopping experience.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="btn-premium px-12 py-5"
            >
              SIGN IN TO PROCEED
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 relative overflow-hidden pb-24">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-100/30 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-100/30 rounded-full blur-[100px] -z-10" />

        <div className="container-custom pt-16">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Main Cart Section */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-4">
                  Shopping <br />
                  <span className="text-gradient">Selection</span>
                </h1>
                <p className="text-slate-400 font-black uppercase tracking-widest text-xs flex items-center gap-2">
                  <ShoppingBag size={14} className="text-emerald-500" />
                  {items.length} Premium Items in Your Bag
                </p>
              </motion.div>

              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass rounded-[4rem] p-24 text-center border-white/50 shadow-2xl"
                >
                  <div className="w-24 h-24 bg-slate-100/50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-slate-400">
                    <Package size={48} />
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter leading-none">Your Selection Is Empty</h2>
                  <p className="text-slate-500 font-medium mb-12">Discover our fresh collection of organic masterpieces.</p>
                  <button
                    onClick={() => navigate('/products')}
                    className="btn-premium px-12 py-5"
                  >
                    START SELECTION
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-8">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="glass rounded-[2.5rem] p-8 flex flex-col sm:flex-row items-center gap-8 border-white/50 shadow-sm hover:shadow-xl transition-all group"
                      >
                        <div className="w-40 h-40 bg-white rounded-[2rem] p-4 flex-shrink-0 relative overflow-hidden shadow-inner border border-slate-50">
                          <img src={item.image || 'https://placehold.co/400x400?text=Premium+Item'} alt={item.sku} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <div>
                              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-tight">{item.sku}</h3>
                              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mt-1">Ready for Delivery</p>
                            </div>
                            <p className="text-2xl font-black text-slate-900 font-serif">Rs. {item.price}</p>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-slate-100">
                            <div className="flex items-center gap-6">
                              <div className="flex items-center glass px-4 py-2 rounded-xl gap-6 border-slate-100 shadow-sm">
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Qty</span>
                                <span className="text-lg font-black text-slate-900 underline underline-offset-4 decoration-emerald-500 decoration-4">{item.quantity}</span>
                              </div>
                              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Sub: <span className="text-slate-900 ml-1">Rs. {item.price * item.quantity}</span></p>
                            </div>

                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="flex items-center gap-2 text-rose-500 hover:text-rose-700 font-black text-xs uppercase tracking-widest transition-colors p-2 hover:bg-rose-50 rounded-xl"
                            >
                              <Trash2 size={16} />
                              Remove Selection
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <aside className="lg:w-[450px] flex-shrink-0">
              <div className="sticky top-24">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass rounded-[3rem] p-10 border-white/50 shadow-2xl flex flex-col h-full bg-white animate-fadeIn"
                >
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-8">Summary</h2>

                  <div className="space-y-6 mb-10 pb-8 border-b border-slate-100 flex-1">
                    <div className="flex justify-between items-center text-sm font-black text-slate-400 uppercase tracking-widest">
                      <span>Subtotal</span>
                      <span className="text-slate-900 text-lg">Rs. {total}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-black text-slate-400 uppercase tracking-widest">
                      <span>Eco-Shipping</span>
                      <span className="text-emerald-600 text-lg">FREE</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-black text-slate-400 uppercase tracking-widest">
                      <span>Taxes</span>
                      <span className="text-slate-900 text-lg">Rs. 0</span>
                    </div>

                    <div className="pt-6 mt-6 border-t-4 border-double border-slate-100 flex justify-between items-end">
                      <span className="text-lg font-black text-slate-900 uppercase tracking-widest">Total Value</span>
                      <span className="text-4xl font-black text-gradient font-serif leading-none">Rs. {total}</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-10">
                    {[
                      { icon: Truck, text: "Carbon-Neutral delivery" },
                      { icon: ShieldCheck, text: "Secured premium checkout" },
                      { icon: RotateCcw, text: "7-Day fresh replacement" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs font-black text-slate-400 uppercase tracking-[0.1em]">
                        <item.icon size={16} className="text-emerald-500" />
                        {item.text}
                      </div>
                    ))}
                  </div>

                  <button
                    disabled={items.length === 0}
                    onClick={() => navigate('/checkout')}
                    className="btn-premium w-full py-6 text-lg flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    COMPLETE SELECTION
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </motion.div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
