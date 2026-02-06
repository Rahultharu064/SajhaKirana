import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
      {/* Safe Area Bottom for iOS */}
      <div className="safe-bottom h-6 sm:h-0"></div>
      
      <footer className="bg-gray-900 text-white py-12 safe-bottom">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <h3 className="text-lg font-semibold mb-4">About SajhaKirana</h3>
              <p className="text-gray-300 leading-relaxed">
                Your trusted online grocery store bringing fresh and quality products to your doorstep with the best prices and service.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/products" className="text-gray-300 hover:text-white transition-colors">Products</Link></li>
                <li><Link to="/cart" className="text-gray-300 hover:text-white transition-colors">Cart</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="mailto:support@sajhakirana.com" className="text-gray-300 hover:text-white transition-colors">support@sajhakirana.com</a></li>
                <li><a href="tel:+977-9840000000" className="text-gray-300 hover:text-white transition-colors">+977-9840000000</a></li>
                <li><Link to="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/returns" className="text-gray-300 hover:text-white transition-colors">Returns & Exchanges</Link></li>
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Policies</h3>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/shipping" className="text-gray-300 hover:text-white transition-colors">Shipping Policy</Link></li>
                <li><Link to="/refund" className="text-gray-300 hover:text-white transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2024 SajhaKirana. All rights reserved. | Made with ❤️ in Nepal
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
