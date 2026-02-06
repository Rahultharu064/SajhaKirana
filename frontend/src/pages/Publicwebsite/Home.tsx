import { useNavigate } from 'react-router-dom';
import Header from '../../components/Publicwebsite/Layouts/Header';
import Footer from '../../components/Publicwebsite/Layouts/Footer';
import Hero from '../../components/Publicwebsite/Homepage/Hero';
import FeaturedProducts from '../../components/Publicwebsite/Homepage/FeaturedProducts';
import BestSelling from '../../components/Publicwebsite/Homepage/BestSelling';
import NewArrivals from '../../components/Publicwebsite/Homepage/NewArrivals';
import Categories from '../../components/Publicwebsite/Homepage/Categories';

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
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      <Header />
      <Hero />
      <FeaturedProducts />
      <BestSelling />
      <NewArrivals />
      <Categories onCategorySelect={handleCategorySelect} />
      <Footer />
    </div>
  );
};

export default Home;
