import ProductCard from '../../ui/ProductCard';

const BestSelling = () => {
  const bestsellingProducts = [
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
    {
      id: 5,
      title: "Green Tea",
      price: 150,
      mrp: 180,
      rating: 4.6,
      image: "/api/placeholder/300/200",
      discount: 17,
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Best Selling</h2>
          <p className="text-lg text-gray-600">Most popular items among our customers</p>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-6 pb-4 min-w-max">
            {bestsellingProducts.map((product) => (
              <div key={`bestseller-${product.id}`} className="flex-shrink-0 w-72">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestSelling;
