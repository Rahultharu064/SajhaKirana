import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Menu, X, User, Package, ChevronDown, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import type { RootState } from '../../../Redux/store';
import SmartSearchBar from './SmartSearchBar';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/category' },
    { name: 'Products', path: '/products' },
    { name: 'Deals', path: '/deals', badge: 'Hot' },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="bg-brand-gradient text-white py-2 text-center text-xs sm:text-sm font-medium relative z-[60]"
      >
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
          <span>Free Delivery on orders over Rs. 1000!</span>
          <Link to="/products" className="underline hover:no-underline font-bold ml-2">Shop Now</Link>
        </div>
      </motion.div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'
          }`}
      >
        <div className="container-custom">
          <div className={`glass rounded-[2rem] px-6 h-16 sm:h-20 flex items-center justify-between transition-all duration-300 ${isScrolled ? 'shadow-2xl border-white/40' : 'shadow-none border-transparent bg-white/40'
            }`}>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="bg-brand-gradient p-2.5 rounded-2xl shadow-lg group-hover:shadow-emerald-500/30 transition-all"
              >
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight bg-brand-gradient bg-clip-text text-transparent">
                  SajhaKirana
                </span>
                <span className="text-[9px] font-bold text-slate-500 -mt-1 tracking-widest uppercase">Premium Grocery</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-all duration-300 hover:bg-white/50 group"
                >
                  {link.name}
                  {link.badge && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-black bg-rose-500 text-white rounded-full shadow-sm">
                      {link.badge}
                    </span>
                  )}
                  <motion.div
                    className="absolute bottom-1 left-5 right-5 h-0.5 bg-brand-gradient scale-x-0 group-hover:scale-x-100 transition-transform origin-center"
                  />
                </Link>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden xl:block">
                <SmartSearchBar />
              </div>

              <Link
                to="/wishlist"
                className="p-2.5 sm:p-3 rounded-2xl hover:bg-rose-50 text-slate-600 hover:text-rose-500 transition-all duration-300 relative group"
              >
                <Heart className="w-5 h-5" />
              </Link>

              <Link
                to="/cart"
                className="p-2.5 sm:p-3 rounded-2xl bg-white/50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 transition-all duration-300 relative group"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 bg-brand-primary text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg border-2 border-white"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Link>

              <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-200">
                <Link
                  to="/login"
                  className="p-2.5 rounded-2xl text-slate-600 hover:text-emerald-600 hover:bg-white/50 transition-all"
                >
                  <User size={20} />
                </Link>
                <Link
                  to="/register"
                  className="btn-premium py-2.5 px-6"
                >
                  Join
                </Link>
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-2xl bg-slate-100/50 hover:bg-slate-200/50 transition-all"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 p-4 lg:hidden"
            >
              <div className="glass rounded-[2rem] p-6 shadow-2xl space-y-4">
                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-4 rounded-2xl text-base font-bold text-slate-700 hover:bg-white/50 transition-all"
                    >
                      <span>{link.name}</span>
                      <ChevronDown size={18} className="-rotate-90 text-slate-400" />
                    </Link>
                  ))}
                </div>
                <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex justify-center items-center gap-2 p-4 rounded-2xl font-bold bg-slate-50 text-slate-700"
                  >
                    <User size={20} /> Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-premium p-4 rounded-2xl"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;
