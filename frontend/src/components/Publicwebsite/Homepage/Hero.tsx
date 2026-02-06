import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Truck, ShieldCheck, Clock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-emerald-50 via-white to-cyan-50 overflow-hidden min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] flex items-center py-12 sm:py-16 lg:py-0">
      {/* Background Decorative Elements - Responsive Sizes */}
      <div className="absolute top-0 right-0 -mr-10 sm:-mr-20 -mt-10 sm:-mt-20 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 -ml-10 sm:-ml-20 -mb-10 sm:-mb-20 w-56 h-56 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-tr from-yellow-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] lg:w-[500px] h-[300px] sm:h-[400px] lg:h-[500px] bg-gradient-to-r from-emerald-200/10 to-cyan-200/10 rounded-full blur-3xl"></div>

      <div className="container-custom relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">

          {/* Text Content - Fully Responsive */}
          <div className="text-center lg:text-left px-4 sm:px-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Badge - Responsive */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-emerald-100 to-cyan-100 border border-emerald-200/50 shadow-sm"
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                <span className="text-xs sm:text-sm font-semibold text-emerald-800">100% Fresh & Organic Products</span>
              </motion.div>

              {/* Main Heading - Responsive Typography */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="text-slate-900 block">Fresh Groceries</span>
                <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-cyan-600 bg-clip-text text-transparent block mt-2">
                  Delivered to Your Door
                </span>
              </h1>

              {/* Subheading - Responsive */}
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed px-2 sm:px-0">
                Experience the convenience of farm-fresh produce and daily essentials delivered within <span className="font-semibold text-emerald-600">30 minutes</span>. Quality you can trust, service you'll love.
              </p>

              {/* CTA Buttons - Responsive */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2 sm:pt-4">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/products')}
                  className="btn-primary group w-full sm:w-auto"
                >
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm sm:text-base">Start Shopping</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/categories')}
                  className="btn-secondary group w-full sm:w-auto"
                >
                  <span className="text-sm sm:text-base">Browse Categories</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>

              {/* Trust Signals - Responsive Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-slate-200 max-w-xl mx-auto lg:mx-0"
              >
                <div className="flex items-center gap-3 group justify-center sm:justify-start">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl sm:rounded-2xl blur-md sm:blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-emerald-500 to-cyan-500 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg">
                      <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-900 text-xs sm:text-sm">Free Delivery</p>
                    <p className="text-[10px] sm:text-xs text-slate-500">Orders over Rs. 1000</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 group justify-center sm:justify-start">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl sm:rounded-2xl blur-md sm:blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-violet-500 to-purple-500 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg">
                      <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-900 text-xs sm:text-sm">100% Secure</p>
                    <p className="text-[10px] sm:text-xs text-slate-500">Payment guaranteed</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 group justify-center sm:justify-start">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl sm:rounded-2xl blur-md sm:blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-amber-500 to-orange-500 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-900 text-xs sm:text-sm">24/7 Support</p>
                    <p className="text-[10px] sm:text-xs text-slate-500">Always here to help</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Hero Image - Show on tablets and above, hide on mobile */}
          <div className="relative hidden md:block">
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative"
            >
              {/* Main Image Container - Responsive Height */}
              <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl border-4 lg:border-8 border-white/50 backdrop-blur-sm">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop"
                  alt="Fresh Grocery Basket"
                  className="w-full h-[400px] sm:h-[500px] lg:h-[550px] object-cover img-responsive"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
              </div>

              {/* Floating Offer Card - Responsive Positioning */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -bottom-4 lg:-bottom-6 -left-4 lg:-left-6 bg-white/95 backdrop-blur-xl p-4 lg:p-6 rounded-xl lg:rounded-2xl shadow-2xl border border-emerald-100 max-w-[250px] lg:max-w-xs"
              >
                <div className="flex items-start gap-3 lg:gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg lg:rounded-xl blur-md opacity-70"></div>
                    <div className="relative bg-gradient-to-br from-green-400 to-emerald-500 p-2 lg:p-3 rounded-lg lg:rounded-xl">
                      <Sparkles className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-base lg:text-lg mb-1">Special Offer!</p>
                    <p className="text-xs lg:text-sm text-slate-600 leading-relaxed">Save up to <span className="font-bold text-emerald-600">30%</span> this week</p>
                  </div>
                </div>
              </motion.div>

              {/* Decorative Blur Elements - Responsive Sizes */}
              <div className="absolute -top-6 lg:-top-10 -right-6 lg:-right-10 w-24 h-24 lg:w-40 lg:h-40 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full opacity-20 blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-6 lg:-bottom-10 -left-6 lg:-left-10 w-24 h-24 lg:w-40 lg:h-40 bg-gradient-to-tr from-violet-400 to-purple-400 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
