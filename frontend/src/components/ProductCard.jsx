import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';
import { FaShoppingCart, FaRupeeSign } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if(product.stockQuantity === 0) {
      toast.error('Out of stock');
      return;
    }
    addToCart(product, 1);
    toast.success(`${product.productName} added to cart`);
  };

  return (
    <div className="bg-dark-light border border-gray-800 rounded-lg overflow-hidden group hover:border-primary transition-colors duration-300 shadow-lg">
      <Link to={`/product/${product._id}`}>
        <div className="relative overflow-hidden h-64">
          <img 
            src={product.image} 
            alt={product.productName} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          {product.stockQuantity === 0 && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              Out of Stock
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <div className="text-sm text-gray-400 mb-1">{product.category}</div>
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-serif font-semibold text-white truncate hover:text-primary transition-colors">
            {product.productName}
          </h3>
        </Link>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-primary font-bold text-xl">
            <FaRupeeSign size={16} /> 
            {product.price.toLocaleString('en-IN')}
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0}
            className={`p-2 rounded-full transition-colors ${
              product.stockQuantity === 0 
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
              : 'bg-primary text-dark-dark hover:bg-primary-light'
            }`}
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
