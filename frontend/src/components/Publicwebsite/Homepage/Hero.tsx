import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Truck, ShieldCheck, Clock, Sparkles, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden min-h-[85vh] flex items-center pt-8 pb-16 sm:py-24">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 -z-10 bg-slate-50">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 100, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-100/50 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -45, 0],
            x: [0, -50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-sky-100/50 rounded-full blur-[100px]" 
        />
      </div>

      <div className="container-custom relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Content Left */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-sm font-bold mb-8 shadow-sm">
                <Zap size={16} className="text-emerald-600 animate-pulse" />
                <span>30 MIN EXPRESS DELIVERY</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black leading-[1.05] tracking-tight mb-8">
                <span className="text-slate-900 block">Freshness</span>
                <span className="bg-brand-gradient bg-clip-text text-transparent block">Delivered.</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Sajha Kirana brings the farm to your doorstep. Organic, locally sourced, and delivered within minutes. 
                <span className="text-emerald-600 font-bold ml-1">Premium quality, every time.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/products')}
                  className="btn-premium text-lg px-10 py-5 flex items-center gap-3"
                >
                  <ShoppingBag size={22} />
                  <span>Shop Now</span>
                  <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/category')}
                  className="btn-glass text-lg px-10 py-5 font-bold text-slate-700"
                >
                  Explore Aisle
                </motion.button>
              </div>

              {/* Trust Signals */}
              <div className="mt-16 pt-10 border-t border-slate-200 grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { icon: Truck, label: 'Free Shipping', val: 'Over Rs. 1000' },
                  { icon: ShieldCheck, label: 'Secure Pay', val: '100% Guaranteed' },
                  { icon: Star, label: 'Top Rated', val: '5k+ Reviews' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center lg:items-start gap-1">
                    <div className="text-emerald-600 mb-1">
                      <item.icon size={20} />
                    </div>
                    <span className="text-sm font-black text-slate-900">{item.label}</span>
                    <span className="text-xs text-slate-500 font-medium">{item.val}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Visuals Right */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative z-10"
            >
              {/* Main Decorative Frame */}
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop"
                  alt="Premium Groceries"
                  className="w-full h-[500px] lg:h-[650px] object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>

              {/* Floating Glass Card 1 - Review */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="glass absolute -top-10 -right-6 p-4 rounded-3xl shadow-2xl max-w-[200px]"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} className="fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-xs font-bold text-slate-800 line-clamp-2">"The freshest vegetables I've ever ordered online!"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200" />
                    <span className="text-[10px] font-black text-slate-500">Sarah M.</span>
                  </div>
                </div>
              </motion.div>

              {/* Floating Glass Card 2 - Offer */}
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-10 -left-10 glass p-6 rounded-[2rem] shadow-2xl flex items-center gap-4 border-l-4 border-emerald-500"
              >
                <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
                  <Sparkles size={24} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest">OFFER</p>
                  <p className="text-xl font-black text-slate-900">30% OFF</p>
                  <p className="text-[10px] font-bold text-slate-500">FIRST PURCHASE</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Background Accent Circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] -z-10 opacity-30">
              <div className="absolute inset-0 border-[40px] border-emerald-100 rounded-full animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-10 border-[20px] border-sky-100 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
