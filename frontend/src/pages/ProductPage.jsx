import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { FaArrowLeft, FaRupeeSign, FaShoppingCart, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        toast.error('Product not found');
        navigate('/shop');
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${product.productName} added to cart`);
    navigate('/cart');
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/shop" className="text-gray-400 hover:text-primary flex items-center gap-2 mb-8 transition-colors width-fit">
        <FaArrowLeft /> Back to Shop
      </Link>

      <div className="bg-dark-light rounded-xl border border-gray-800 p-6 md:p-10 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="rounded-lg overflow-hidden border border-gray-700 bg-dark self-start">
            <img 
              src={product.image} 
              alt={product.productName} 
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <div className="text-primary text-sm font-bold tracking-wider uppercase mb-2">
              {product.category}
            </div>
            <h1 className="text-3xl md:text-5xl font-serif text-white mb-4">
              {product.productName}
            </h1>
            
            <div className="flex items-center text-3xl text-primary font-bold mb-6">
              <FaRupeeSign size={24} /> {product.price?.toLocaleString('en-IN')}
            </div>

            <p className="text-gray-300 md:text-lg mb-8 leading-relaxed border-b border-gray-800 pb-8">
              {product.description}
            </p>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-400">Status:</span>
                {product.stockQuantity > 0 ? (
                  <span className="text-green-500 flex items-center gap-1 font-bold">
                    <FaCheckCircle /> In Stock ({product.stockQuantity} available)
                  </span>
                ) : (
                  <span className="text-red-500 flex items-center gap-1 font-bold">
                    <FaTimesCircle /> Out of Stock
                  </span>
                )}
              </div>

              {product.stockQuantity > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-gray-400">Quantity:</span>
                  <select 
                    className="input-field w-24"
                    value={qty} 
                    onChange={(e) => setQty(Number(e.target.value))}
                  >
                    {[...Array(product.stockQuantity).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}
              className={`w-full py-4 rounded font-bold text-lg flex justify-center items-center gap-2 transition-colors ${
                product.stockQuantity === 0 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-primary text-dark-dark hover:bg-primary-light'
              }`}
            >
              <FaShoppingCart /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
