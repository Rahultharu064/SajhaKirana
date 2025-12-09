import React from 'react';

interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
}

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  const { name, image } = category;

  // Construct full image URL using API base URL
  const imageUrl = image
    ? `${import.meta.env.VITE_API_BASE_URL}${image}`
    : '/placeholder-category.jpg';

  const handleImageError = () => {
    console.warn(`Failed to load category image for "${name}": ${imageUrl}`);
  };

  const handleImageLoad = () => {
    console.log(`Successfully loaded category image for "${name}"`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer group overflow-hidden"
      onClick={onClick}
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onLoad={handleImageLoad}
          onError={(e) => {
            handleImageError();
            (e.target as HTMLImageElement).src = '/placeholder-category.jpg';
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 text-center group-hover:text-blue-600 transition-colors duration-200">
          {name}
        </h3>
      </div>
    </div>
  );
};

export default CategoryCard;
