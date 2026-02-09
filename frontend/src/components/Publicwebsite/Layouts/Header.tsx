import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Menu, X, User, Package, Search, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import SmartSearchBar from './SmartSearchBar';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/category' },
    { name: 'Products', path: '/products' },
    { name: 'Deals', path: '/deals', badge: 'Hot' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white py-2 text-center text-sm font-medium relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 flex items-center justify-center gap-2">
          <span className="animate-pulse">🎉</span>
          <span>Free Delivery on orders over Rs. 1000!</span>
          <Link to="/products" className="underline hover:no-underline font-semibold ml-2">Shop Now →</Link>
        </div>
      </div>

      <header className="bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-900/5 sticky top-0 z-50 border-b border-slate-100">
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-emerald-600 to-teal-500 p-2.5 rounded-2xl shadow-lg shadow-emerald-600/30">
                  <Package className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  SajhaKirana
                </span>
                <span className="text-[10px] font-semibold text-slate-500 -mt-1 tracking-wider uppercase">Fresh & Fast Delivery</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 flex items-center gap-1.5"
                >
                  {link.name}
                  {link.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Smart Search - Desktop */}
              <div className="hidden xl:block">
                <SmartSearchBar />
              </div>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-3 rounded-xl hover:bg-rose-50 transition-all duration-200 group"
                aria-label="View wishlist"
              >
                <Heart className="w-5 h-5 text-slate-500 group-hover:text-rose-500 transition-colors" />
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-3 rounded-xl hover:bg-emerald-50 transition-all duration-200 group"
              >
                <ShoppingCart className="w-5 h-5 text-slate-500 group-hover:text-emerald-600 transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg shadow-emerald-500/40 animate-pulse">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Login/Register - Desktop */}
              <div className="hidden md:flex items-center gap-2 ml-2 pl-4 border-l border-slate-200">
                <Link
                  to="/login"
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 flex items-center gap-2"
                >
                  <User size={16} />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 transition-all duration-200 hover:-translate-y-0.5"
                >
                  Sign Up Free
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl hover:bg-slate-100 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-slate-700" />
                ) : (
                  <Menu className="w-6 h-6 text-slate-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="xl:hidden pb-4">
            <SmartSearchBar />
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl">
            <nav className="container-custom py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
                >
                  <span className="flex items-center gap-2">
                    {link.name}
                    {link.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </span>
                  <ChevronDown size={16} className="text-slate-400 -rotate-90" />
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
                >
                  <User className="w-5 h-5" />
                  Login to Your Account
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 text-center shadow-lg shadow-emerald-600/30"
                >
                  Create Free Account
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
