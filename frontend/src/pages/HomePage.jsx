import { useState, useEffect } from 'react';
import API from '../utils/api';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get('/api/products');
        setProducts(data.slice(0, 4)); // Show only latest 4 on home
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] bg-dark-dark flex items-center">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1599643477874-124b89ea6bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Jewellery Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-serif text-primary mb-6 drop-shadow-lg">
              Elegance in Every Detail
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-lg">
              Discover our exclusive collection of luxury bangles, chains, rings, and earrings designed for the modern woman.
            </p>
            <div className="flex gap-4">
              <Link to="/shop" className="btn-primary px-8 py-3 text-lg">
                Shop Collection
              </Link>
              <Link to="/contact" className="btn-outline px-8 py-3 text-lg">
                Visit Store
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif text-center text-primary mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Bangles', 'Chains', 'Rings', 'Earrings'].map((category) => (
              <Link key={category} to={`/shop?category=${category}`} className="group block">
                <div className="relative h-48 rounded-lg overflow-hidden border border-gray-800 group-hover:border-primary transition-all">
                  <div className="absolute inset-0 bg-dark-dark opacity-60 group-hover:opacity-40 transition-opacity z-10"></div>
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <h3 className="text-2xl font-serif text-white group-hover:text-primary transition-colors">{category}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-dark-light">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-serif text-primary mb-2">New Arrivals</h2>
              <p className="text-gray-400">Our latest additions to the luxury collection</p>
            </div>
            <Link to="/shop" className="text-primary hover:text-white transition-colors border-b border-primary">
              View All
            </Link>
          </div>
          
          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
