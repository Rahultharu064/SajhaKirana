import Header from '../../components/Publicwebsite/Layouts/Header';
import Footer from '../../components/Publicwebsite/Layouts/Footer';
import Hero from '../../components/Publicwebsite/Homepage/Hero';
import FeaturedProducts from '../../components/Publicwebsite/Homepage/FeaturedProducts';
import BestSelling from '../../components/Publicwebsite/Homepage/BestSelling';
import NewArrivals from '../../components/Publicwebsite/Homepage/NewArrivals';
import Categories from '../../components/Publicwebsite/Homepage/Categories';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <FeaturedProducts />
      <BestSelling />
      <NewArrivals />
      <Categories />
      <Footer />
    </div>
  );
};

export default Home;
