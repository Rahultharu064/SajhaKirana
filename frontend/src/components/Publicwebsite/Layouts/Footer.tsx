import { Link } from 'react-router-dom';
import { Package, Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ArrowRight, Sparkles } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="container-custom relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <Sparkles size={16} className="text-yellow-300" />
                <span className="text-sm font-semibold text-white">Get Exclusive Offers</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-emerald-100 max-w-md">
                Get updates on new products, special offers, and seasonal deals delivered to your inbox.
              </p>
            </div>

            <div className="w-full lg:w-auto">
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3.5 rounded-xl bg-white/95 backdrop-blur-sm border-2 border-white/20 focus:border-white focus:outline-none text-slate-700 placeholder:text-slate-400 font-medium"
                />
                <button className="px-6 py-3.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-xl shadow-black/20">
                  Subscribe
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="bg-slate-900 text-white pt-16 pb-8">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="space-y-6">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-emerald-500 to-teal-500 p-2.5 rounded-2xl">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-white">SajhaKirana</span>
                  <span className="text-[10px] font-medium text-slate-400">Fresh & Fast Delivery</span>
                </div>
              </Link>
              <p className="text-slate-400 leading-relaxed text-sm">
                Your trusted online grocery store bringing fresh and quality products to your doorstep with the best prices and service.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {[
                  { icon: Facebook, href: '#', color: 'hover:bg-blue-600' },
                  { icon: Instagram, href: '#', color: 'hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500' },
                  { icon: Twitter, href: '#', color: 'hover:bg-sky-500' },
                  { icon: Youtube, href: '#', color: 'hover:bg-red-600' },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white ${social.color} transition-all duration-300`}
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></span>
                Quick Links
              </h4>
              <ul className="space-y-3">
                {[
                  { name: 'About Us', path: '/about' },
                  { name: 'Products', path: '/products' },
                  { name: 'Categories', path: '/category' },
                  { name: 'My Orders', path: '/orders' },
                  { name: 'Wishlist', path: '/wishlist' },
                ].map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-slate-400 hover:text-emerald-400 transition-colors text-sm flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-500 rounded transition-all duration-300"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"></span>
                Support
              </h4>
              <ul className="space-y-3">
                {[
                  { name: 'Help Center', path: '/help' },
                  { name: 'FAQ', path: '/faq' },
                  { name: 'Returns & Exchanges', path: '/returns' },
                  { name: 'Shipping Policy', path: '/shipping' },
                  { name: 'Contact Us', path: '/contact' },
                ].map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-slate-400 hover:text-violet-400 transition-colors text-sm flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-violet-500 rounded transition-all duration-300"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></span>
                Contact Us
              </h4>
              <ul className="space-y-4">
                <li>
                  <a href="mailto:support@sajhakirana.com" className="flex items-start gap-3 text-slate-400 hover:text-amber-400 transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                      <Mail size={16} className="group-hover:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Email</p>
                      <p className="text-sm">support@sajhakirana.com</p>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="tel:+977-9840000000" className="flex items-start gap-3 text-slate-400 hover:text-amber-400 transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                      <Phone size={16} className="group-hover:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Phone</p>
                      <p className="text-sm">+977-9840000000</p>
                    </div>
                  </a>
                </li>
                <li>
                  <div className="flex items-start gap-3 text-slate-400">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Address</p>
                      <p className="text-sm">Kathmandu, Nepal</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm text-center md:text-left">
              © {currentYear} SajhaKirana. All rights reserved. Made with ❤️ in Nepal
            </p>
            <div className="flex items-center gap-6">
              {['Terms', 'Privacy', 'Cookies'].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
