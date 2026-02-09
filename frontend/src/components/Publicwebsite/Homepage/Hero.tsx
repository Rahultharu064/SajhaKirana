import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Truck, ShieldCheck, Clock, Sparkles, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-hidden min-h-[600px] sm:min-h-[700px] lg:min-h-[800px] flex items-center py-16 sm:py-20 lg:py-0">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 sm:w-[500px] sm:h-[500px] bg-gradient-to-br from-emerald-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 sm:w-[600px] sm:h-[600px] bg-gradient-to-tr from-yellow-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '3s' }}></div>
      </div>

      {/* Floating Decorative Elements */}
      <motion.div
        className="absolute top-32 right-20 hidden lg:block"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/30">
          <Star className="w-8 h-8 text-white fill-current" />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-40 left-20 hidden lg:block"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/30">
          <Zap className="w-7 h-7 text-white" />
        </div>
      </motion.div>

      <div className="container-custom relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Text Content */}
          <div className="text-center lg:text-left px-4 sm:px-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 via-emerald-50 to-cyan-100 border border-emerald-200/60 shadow-lg shadow-emerald-500/10"
              >
                <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span className="text-sm font-bold text-emerald-800">100% Fresh & Organic Products</span>
              </motion.div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
                <span className="text-slate-900 block">Fresh Groceries</span>
                <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent block mt-2">
                  Delivered Fast
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Experience the convenience of farm-fresh produce and daily essentials delivered to your doorstep in just <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">30 minutes</span>.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/products')}
                  className="relative overflow-hidden group px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-2xl font-bold text-base flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/30 hover:shadow-2xl hover:shadow-emerald-600/40 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <ShoppingBag className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" />
                  <span className="relative z-10">Start Shopping</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/categories')}
                  className="px-8 py-4 bg-white text-slate-700 rounded-2xl font-bold text-base flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-emerald-300 hover:text-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span>Browse Categories</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>

              {/* Trust Signals */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-slate-200 max-w-xl mx-auto lg:mx-0"
              >
                {[
                  { icon: Truck, title: 'Free Delivery', desc: 'Orders over Rs. 1000', gradient: 'from-emerald-500 to-cyan-500' },
                  { icon: ShieldCheck, title: '100% Secure', desc: 'Payment guaranteed', gradient: 'from-violet-500 to-purple-500' },
                  { icon: Clock, title: '24/7 Support', desc: 'Always here to help', gradient: 'from-amber-500 to-orange-500' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 group justify-center sm:justify-start">
                    <div className="relative flex-shrink-0">
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity`}></div>
                      <div className={`relative bg-gradient-to-br ${item.gradient} p-3 rounded-2xl shadow-lg`}>
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-900 text-sm">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              {/* Main Image */}
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white/60 backdrop-blur-sm">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop"
                  alt="Fresh Grocery Basket"
                  className="w-full h-[550px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent"></div>
              </div>

              {/* Floating Stats Card */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-xl p-5 rounded-3xl shadow-2xl border border-emerald-100 max-w-[280px]"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl blur-md opacity-60"></div>
                    <div className="relative bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-2xl">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-900 text-lg mb-0.5">Special Offer!</p>
                    <p className="text-sm text-slate-600">Save up to <span className="font-bold text-emerald-600">30%</span> this week</p>
                  </div>
                </div>
              </motion.div>

              {/* Reviews Card */}
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-xl px-5 py-4 rounded-2xl shadow-2xl border border-violet-100"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                        {i}k
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 font-medium">10k+ Happy Customers</p>
                  </div>
                </div>
              </motion.div>

              {/* Decorative Blurs */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-violet-400 to-purple-400 rounded-full opacity-20 blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
