import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FaTrash, FaRupeeSign } from 'react-icons/fa';

const CartPage = () => {
  const { cartItems, addToCart, removeFromCart, selectedItems, toggleItemSelection, setAllSelected } = useContext(CartContext);
  const navigate = useNavigate();

  const checkoutHandler = () => {
    if (selectedItems.length === 0) return;
    navigate('/login?redirect=/checkout');
  };
  
  const selectedCartItems = cartItems.filter(item => selectedItems.includes(item._id));
  const isAllSelected = cartItems.length > 0 && selectedItems.length === cartItems.length;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-serif text-primary mb-8 border-b border-gray-800 pb-4">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="bg-dark-light p-8 rounded border border-gray-800 text-center">
          <p className="text-xl text-gray-300 mb-6">Your cart is currently empty.</p>
          <Link to="/shop" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {/* Select All Checkbox */}
            <div className="bg-dark-light p-4 rounded border border-gray-800 flex items-center gap-3">
              <input 
                 type="checkbox" 
                 checked={isAllSelected}
                 onChange={(e) => setAllSelected(e.target.checked)}
                 className="w-5 h-5 accent-primary cursor-pointer"
                 id="selectAll"
              />
              <label htmlFor="selectAll" className="text-white cursor-pointer select-none font-serif">Select All Items</label>
            </div>

            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center gap-6 bg-dark-light p-4 rounded border border-gray-800 transition-colors">
                <input 
                    type="checkbox"
                    checked={selectedItems.includes(item._id)}
                    onChange={() => toggleItemSelection(item._id)}
                    className="w-5 h-5 accent-primary cursor-pointer"
                />
                
                <img src={item.image} alt={item.productName} className="w-24 h-24 object-cover rounded" />
                
                <div className="flex-grow">
                  <Link to={`/product/${item._id}`} className="text-lg text-white hover:text-primary transition-colors font-serif block mb-1">
                    {item.productName}
                  </Link>
                  <div className="text-primary font-bold flex items-center">
                    <FaRupeeSign size={14} /> {item.price.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <select 
                    className="input-field w-20"
                    value={item.qty}
                    onChange={(e) => addToCart(item, Number(e.target.value))}
                  >
                    {[...Array(item.stockQuantity).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>

                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-400 p-2"
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-dark-light p-6 rounded border border-gray-800 h-fit sticky top-24">
            <h2 className="text-2xl font-serif text-white mb-6 border-b border-gray-700 pb-4">Order Summary</h2>
            
            <div className="flex justify-between items-center mb-4 text-gray-300">
              <span>Selected Items ({selectedCartItems.reduce((acc, item) => acc + item.qty, 0)}):</span>
              <span className="flex items-center font-bold text-white">
                <FaRupeeSign size={14} /> 
                {selectedCartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toLocaleString('en-IN')}
              </span>
            </div>
            
            <div className="border-t border-gray-700 pt-6 mt-6">
              <button 
                onClick={checkoutHandler}
                disabled={selectedItems.length === 0}
                className={`w-full py-3 text-lg font-bold rounded ${selectedItems.length === 0 ? 'bg-gray-600 cursor-not-allowed text-gray-400' : 'btn-primary'}`}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
