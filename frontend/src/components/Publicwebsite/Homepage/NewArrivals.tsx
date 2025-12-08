import ProductCard from '../../ui/ProductCard';

const NewArrivals = () => {
  const newArrivals = [
    {
      id: 1,
      title: "Premium Rice Per Kg",
      price: 120,
      mrp: 150,
      rating: 4.5,
      image: "/api/placeholder/300/200",
      discount: 20,
    },
    {
      id: 2,
      title: "Organic Lentils",
      price: 180,
      mrp: 220,
      rating: 4.2,
      image: "/api/placeholder/300/200",
      discount: 18,
    },
    {
      id: 3,
      title: "Fresh Milk 1L",
      price: 85,
      mrp: 95,
      rating: 4.8,
      image: "/api/placeholder/300/200",
      discount: 11,
    },
    {
      id: 4,
      title: "Cooking Oil",
      price: 220,
      mrp: 250,
      rating: 4.3,
      image: "/api/placeholder/300/200",
      discount: 12,
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">New Arrivals</h2>
          <p className="text-lg text-gray-600">Fresh products just arrived in our store</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={`new-${product.id}`} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
