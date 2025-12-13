import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
            <form onSubmit={handleSearch} className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-gray-700 placeholder-gray-500 w-48"
              />
              <button type="submit" className="ml-2 p-1 rounded hover:bg-gray-200" aria-label="Search">
                <Search className="h-4 w-4 text-gray-600" />
              </button>
            </form>

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
