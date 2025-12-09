import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Heart } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';

const Header = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-emerald-600">
            SajhaKirana
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-900 hover:text-emerald-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/category" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Category
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Products
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-emerald-600 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Utilities */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button className="p-2 rounded-full hover:bg-gray-100" aria-label="Search products">
              <Search className="h-5 w-5 text-gray-600" />
            </button>

            {/* Wishlist */}
            <button className="p-2 rounded-full hover:bg-gray-100" aria-label="View wishlist">
              <Heart className="h-5 w-5 text-gray-600" />
            </button>

            {/* Cart */}
            <Link to="/cart" className="p-2 rounded-full hover:bg-gray-100 relative">
              <ShoppingCart className="h-5 w-5 text-gray-600" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Login/Register */}
            <div className="flex items-center space-x-2">
              <Link to="/login" className="text-gray-700 hover:text-emerald-600 font-medium">
                Login
              </Link>
              <span className="text-gray-400">/</span>
              <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
