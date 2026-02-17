import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Truck, ShieldCheck, Clock, Sparkles, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-slate-50 overflow-hidden min-h-[600px] sm:min-h-[700px] lg:min-h-[800px] flex items-center py-16 sm:py-20 lg:py-0">
      {/* Subtle Background Element */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-3xl opacity-60"></div>
      </div>



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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">100% Fresh & Organic Products</span>
              </motion.div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
                <span className="text-slate-900 block">Fresh Groceries</span>
                <span className="text-emerald-600 block mt-2">
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
                  className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-base flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Start Shopping</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/categories')}
                  className="px-8 py-4 bg-white text-slate-700 rounded-xl font-semibold text-base flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-emerald-500 hover:text-emerald-600 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <span>Browse Categories</span>
                  <ArrowRight className="w-5 h-5" />
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
                  { icon: Truck, title: 'Free Delivery', desc: 'Orders over Rs. 1000', color: 'emerald' },
                  { icon: ShieldCheck, title: '100% Secure', desc: 'Payment guaranteed', color: 'blue' },
                  { icon: Clock, title: '24/7 Support', desc: 'Always here to help', color: 'amber' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 justify-center sm:justify-start">
                    <div className={`bg-${item.color}-100 p-3 rounded-xl`}>
                      <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-slate-900 text-sm">{item.title}</p>
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
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop"
                  alt="Fresh Grocery Basket"
                  className="w-full h-[550px] object-cover"
                />
              </div>

              {/* Floating Stats Card */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-white p-5 rounded-xl shadow-lg border border-emerald-100 max-w-[280px]"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-500 p-3 rounded-xl">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-base mb-0.5">Special Offer!</p>
                    <p className="text-sm text-slate-600">Save up to <span className="font-semibold text-emerald-600">30%</span> this week</p>
                  </div>
                </div>
              </motion.div>

              {/* Reviews Card */}
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className="absolute -top-4 -right-4 bg-white px-5 py-4 rounded-xl shadow-lg border border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 font-semibold">10k+ Reviews</p>
                </div>
              </motion.div>


            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
