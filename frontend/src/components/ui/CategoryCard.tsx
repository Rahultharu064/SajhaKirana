interface CategoryCardProps {
  category: {
    id: number;
    name: string;
    image?: string;
  };
  onClick?: () => void;
}

const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
  return (
    <div onClick={onClick} className="group cursor-pointer">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden text-center">
        <div className="h-32 flex items-center justify-center text-6xl">
          🛒
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
            {category.name}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
