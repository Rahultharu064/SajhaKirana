import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../../components/Publicwebsite/Layouts/Header';
import Footer from '../../components/Publicwebsite/Layouts/Footer';
import Hero from '../../components/Publicwebsite/Homepage/Hero';
import FeaturedProducts from '../../components/Publicwebsite/Homepage/FeaturedProducts';
import BestSelling from '../../components/Publicwebsite/Homepage/BestSelling';
import NewArrivals from '../../components/Publicwebsite/Homepage/NewArrivals';
import Categories from '../../components/Publicwebsite/Homepage/Categories';
import { Sparkles, Truck, Shield, Clock, Gift, HeadphonesIcon, CreditCard, Sprout, Zap, Banknote, Lock, Bot, PhoneCall } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
}

const Home = () => {
  const navigate = useNavigate();

  const handleCategorySelect = (category: Category) => {
    navigate(`/category/${category.slug}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />

      {/* Trust Badges Section */}
      <section className="py-12 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/subtle-dots.png')] opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Free Delivery', desc: 'Orders over Rs. 1000', color: 'bg-emerald-500' },
              { icon: Shield, title: 'Secure Pay', desc: '100% Protected', color: 'bg-violet-500' },
              { icon: Clock, title: 'Express', desc: '30 Min Delivery', color: 'bg-amber-500' },
              { icon: HeadphonesIcon, title: 'Live Support', desc: '24/7 Assistance', color: 'bg-rose-500' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-5 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all group"
              >
                <div className={`w-12 h-12 rounded-2xl ${item.color} flex-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <item.icon size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-black text-white text-xs sm:text-sm uppercase tracking-wider">{item.title}</h3>
                  <p className="text-slate-400 text-[10px] sm:text-xs font-medium">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedProducts />

      {/* Promotional Banner */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-indigo-600/20"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px]"></div>

        <div className="container-custom relative z-10">
          <div className="glass-dark rounded-[3.5rem] p-8 sm:p-16 text-center border-white/5 overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10 max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-8">
                <Gift size={18} className="text-amber-400" />
                <span className="text-xs font-black text-white uppercase tracking-widest">Limited Time Offer</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
                Fresh Savings <br />
                <span className="text-gradient">30% DISCOUNT</span>
              </h2>
              <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto font-medium">
                Experience the premium farm-to-table delivery. Use code <span className="text-white font-black bg-white/10 px-3 py-1 rounded-lg">FARM30</span>
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/products')}
                className="btn-premium px-12 py-5 text-lg"
              >
                Claim Your Discount
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      <BestSelling />
      <NewArrivals />
      <Categories onCategorySelect={handleCategorySelect} />

      {/* Features Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-slate-50/50 -z-10 skew-y-3"></div>
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-slate-200"></div>
              <span className="text-emerald-600 font-black text-xs uppercase tracking-[0.3em]">The Sajha Way</span>
              <div className="h-px w-12 bg-slate-200"></div>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 mb-6">
              Why Choose <span className="text-gradient">Sajha Kirana?</span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">
              We've redesigned the grocery experience from the ground up to bring you premium quality with unmatched speed.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {[
              {
                icon: Sprout,
                title: 'Organic Sourcing',
                desc: 'Direct partnerships with ethical local farms for zero-compromise freshness.',
                color: 'bg-emerald-500',
              },
              {
                icon: Zap,
                title: '30-Min Delivery',
                desc: 'Proprietary logistics network ensuring your groceries arrive while they are still fresh.',
                color: 'bg-amber-500',
              },
              {
                icon: Banknote,
                title: 'Wholesale Rates',
                desc: 'Direct-to-consumer model that eliminates middlemen and saves you up to 25% daily.',
                color: 'bg-blue-500',
              },
              {
                icon: Lock,
                title: 'Secure Checkout',
                desc: 'Military grade encryption for all your financial data and personal information.',
                color: 'bg-indigo-500',
              },
              {
                icon: Bot,
                title: 'AI Smart Cart',
                desc: 'Intelligent assistant that learns your dietary needs and suggests the best seasonal picks.',
                color: 'bg-purple-500',
              },
              {
                icon: PhoneCall,
                title: 'Human Support',
                desc: 'Round the clock assistance from real people who care about your family needs.',
                color: 'bg-rose-500',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-[3rem] p-10 hover:border-emerald-500/30 group"
              >
                <div className={`w-16 h-16 rounded-[1.5rem] ${item.color} flex-center mb-8 shadow-xl shadow-slate-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <item.icon size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{item.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
