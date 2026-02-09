import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../../components/Publicwebsite/Layouts/Header';
import Footer from '../../components/Publicwebsite/Layouts/Footer';
import Hero from '../../components/Publicwebsite/Homepage/Hero';
import FeaturedProducts from '../../components/Publicwebsite/Homepage/FeaturedProducts';
import BestSelling from '../../components/Publicwebsite/Homepage/BestSelling';
import NewArrivals from '../../components/Publicwebsite/Homepage/NewArrivals';
import Categories from '../../components/Publicwebsite/Homepage/Categories';
import { Sparkles, Truck, Shield, Clock, Gift, HeadphonesIcon, CreditCard } from 'lucide-react';

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
      <section className="py-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/subtle-dots.png')] opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Free Delivery', desc: 'On orders over Rs. 1000', color: 'from-emerald-400 to-teal-500' },
              { icon: Shield, title: 'Secure Payment', desc: '100% protected checkout', color: 'from-violet-400 to-purple-500' },
              { icon: Clock, title: 'Fast Shipping', desc: '30 min express delivery', color: 'from-amber-400 to-orange-500' },
              { icon: HeadphonesIcon, title: '24/7 Support', desc: 'Always here to help', color: 'from-pink-400 to-rose-500' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                  <item.icon size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{item.title}</h3>
                  <p className="text-slate-400 text-xs">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedProducts />

      {/* Promotional Banner */}
      <section className="py-16 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              <Gift size={18} className="text-yellow-300" />
              <span className="text-sm font-bold text-white">Limited Time Offer</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Get <span className="text-yellow-300">30% OFF</span> on Your First Order
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
              Use code <span className="font-mono bg-white/20 px-3 py-1 rounded-lg font-bold">WELCOME30</span> at checkout
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/products')}
              className="px-8 py-4 bg-white text-violet-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all inline-flex items-center gap-2"
            >
              <Sparkles size={20} />
              Shop Now
            </motion.button>
          </motion.div>
        </div>
      </section>

      <BestSelling />
      <NewArrivals />
      <Categories onCategorySelect={handleCategorySelect} />

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Why Choose <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">SajhaKirana</span>?
            </h2>
            <p className="text-slate-600 max-w-lg mx-auto">
              We're committed to providing the best shopping experience with quality products and exceptional service.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: 'Fresh & Quality',
                desc: 'All products are sourced directly from farms and quality-checked before delivery.',
                gradient: 'from-emerald-500 to-teal-500',
                shadow: 'shadow-emerald-500/20'
              },
              {
                icon: CreditCard,
                title: 'Easy Payment',
                desc: 'Multiple payment options including Cash on Delivery, eSewa, and Khalti.',
                gradient: 'from-violet-500 to-purple-500',
                shadow: 'shadow-violet-500/20'
              },
              {
                icon: Truck,
                title: 'Fast Delivery',
                desc: 'Get your orders delivered within 30 minutes in Kathmandu valley.',
                gradient: 'from-amber-500 to-orange-500',
                shadow: 'shadow-amber-500/20'
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="bg-white rounded-3xl p-8 border border-slate-100 hover:shadow-2xl transition-all duration-300 group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 shadow-xl ${item.shadow} group-hover:scale-110 transition-transform`}>
                  <item.icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
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
