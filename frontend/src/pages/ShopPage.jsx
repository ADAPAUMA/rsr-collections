import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { FaSearch } from 'react-icons/fa';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Filter State
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  
  const location = useLocation();

  useEffect(() => {
    // Check if category is passed in URL
    const searchParams = new URLSearchParams(location.search);
    const catParam = searchParams.get('category');
    if (catParam) {
      setCategory(catParam);
    }
  }, [location]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = '/api/products?';
        if (keyword) url += `keyword=${keyword}&`;
        if (category) url += `category=${category}`;
        
        const { data } = await axios.get(url);
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    
    // Add a small debounce for search
    const timer = setTimeout(() => {
        fetchProducts();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [keyword, category]);

  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/products/categories');
        setCategories(['All', ...data]);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-serif text-primary mb-8 border-b border-gray-800 pb-4">Our Collection</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-1/4">
          <div className="bg-dark-light p-6 rounded-lg border border-gray-800 sticky top-24">
            <h2 className="text-xl font-serif text-white mb-4">Filters</h2>
            
            {/* Search */}
            <div className="mb-6 relative">
              <input 
                type="text" 
                placeholder="Search products..." 
                className="input-field pl-10"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-500" />
            </div>
            
            {/* Categories */}
            <div>
              <h3 className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-3">Categories</h3>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button 
                      onClick={() => setCategory(cat === 'All' ? '' : cat)}
                      className={`text-left w-full transition-colors ${
                        (category === cat) || (category === '' && cat === 'All')
                          ? 'text-primary font-bold' 
                          : 'text-gray-300 hover:text-primary'
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Product Grid */}
        <div className="w-full md:w-3/4">
          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <div className="bg-dark-light p-8 rounded-lg text-center border border-gray-800 text-gray-400">
              No products found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
