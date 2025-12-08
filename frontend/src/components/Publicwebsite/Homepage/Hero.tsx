const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Fresh & Quality<br />
            <span className="text-yellow-300">Groceries</span> Delivered
          </h1>
          <p className="text-xl mb-8 text-emerald-100">
            Get fresh produce, dairy, and staples delivered to your doorstep at the best prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 rounded-lg text-lg transition-colors">
              Shop Now
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-emerald-800 font-semibold px-8 py-3 rounded-lg text-lg transition-all">
              Explore Categories
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
