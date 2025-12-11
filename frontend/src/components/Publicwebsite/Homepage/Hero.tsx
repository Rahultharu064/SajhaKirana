import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Truck, ShieldCheck, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-emerald-50 overflow-hidden min-h-[600px] flex items-center">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-yellow-100 rounded-full blur-3xl opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Text Content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold mb-6">
                🥬 100% Organic & Fresh
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
                Fresh Groceries <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                  Delivered Fast
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                Experience the convenience of farm-fresh produce and daily essentials delivered right to your doorstep within minutes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/products')}
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-full text-lg shadow-lg shadow-emerald-200 transition-all"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Shop Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/categories')}
                  className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-emerald-500 text-gray-700 hover:text-emerald-600 font-bold px-8 py-4 rounded-full text-lg shadow-sm hover:shadow-md transition-all"
                >
                  Explore Categories
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Trust Signals */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 md:gap-12 border-t border-gray-200 pt-8">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-full shadow-sm text-emerald-600">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900 text-sm">Free Delivery</p>
                    <p className="text-xs text-gray-500">On orders over Rs. 1000</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-full shadow-sm text-emerald-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900 text-sm">Secure Payment</p>
                    <p className="text-xs text-gray-500">100% secure checkout</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-full shadow-sm text-emerald-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900 text-sm">24/7 Support</p>
                    <p className="text-xs text-gray-500">Ready to help you</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative z-10"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop"
                  alt="Fresh Grocery Market"
                  className="w-full h-[600px] object-cover"
                />
                {/* Floating Badge */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg flex items-center gap-4 max-w-xs"
                >
                  <div className="bg-green-100 p-3 rounded-full text-green-600">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Weekly Offers</p>
                    <p className="text-xs text-gray-500">Save up to 30% on fresh vegetables this week!</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Abstract Shapes behind image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-emerald-200 to-transparent rounded-full opacity-30 blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
