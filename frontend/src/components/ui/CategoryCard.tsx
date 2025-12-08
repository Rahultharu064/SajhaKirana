import { Link } from 'react-router-dom';

interface CategoryCardProps {
  category: {
    id: number;
    name: string;
    image: string;
    icon: string;
  };
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link to={`/category/${category.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden text-center">
        <div className="h-32 flex items-center justify-center text-6xl">
          {category.icon}
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
            {category.name}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
