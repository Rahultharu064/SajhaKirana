import CategoryCard from '../../ui/CategoryCard';

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: "Groceries",
      image: "/api/placeholder/200/150",
      icon: "🛒",
    },
    {
      id: 2,
      name: "Beverages",
      image: "/api/placeholder/200/150",
      icon: "🥤",
    },
    {
      id: 3,
      name: "Snacks",
      image: "/api/placeholder/200/150",
      icon: "🍿",
    },
    {
      id: 4,
      name: "Dairy",
      image: "/api/placeholder/200/150",
      icon: "🥛",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-lg text-gray-600">Browse our wide range of grocery categories</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
