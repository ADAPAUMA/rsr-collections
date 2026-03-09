import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';
import { FaRupeeSign } from 'react-icons/fa';

const CheckoutPage = () => {
  const { userInfo } = useContext(AuthContext);
  const { cartItems, selectedItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Shipping details state
  const [fullName, setFullName] = useState(userInfo?.name || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  
  // Fixed City as requested
  const city = 'Kakinada'; 

  // Filter cart items to only those selected for checkout
  const checkoutItems = cartItems.filter(item => selectedItems.includes(item._id));

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/checkout');
    }
    // If they navigated here with nothing selected, send them back to the cart
    if (checkoutItems.length === 0) {
      navigate('/cart');
    }
  }, [userInfo, navigate, checkoutItems.length]);

  const itemsPrice = checkoutItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 5000 ? 0 : 50; // Free shipping over 5000
  const totalPrice = itemsPrice + shippingPrice;

  const placeOrderHandler = async (e) => {
    e.preventDefault();
    if(!fullName || !phoneNumber || !address || !postalCode) {
        toast.error('Please enter all shipping details');
        return;
    }
    
    // Basic Kakinada PIN code validation (typically starts with 533)
    if (!postalCode.startsWith('533') || postalCode.length !== 6) {
        toast.error('Delivery is strictly restricted to Kakinada PIN codes only (e.g., 533001).');
        return;
    }
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post('/api/orders', {
          orderItems: checkoutItems.map(item => ({
              ...item,
              name: item.productName // Map productName to name for backend schema
          })),
          shippingAddress: { fullName, phoneNumber, address, city, postalCode, country: 'India' },
          paymentMethod: 'Cash on Delivery',
          itemsPrice,
          shippingPrice,
          totalPrice
      }, config);

      toast.success('Order Placed Successfully!');
      navigate(`/order/${data._id}`);

    } catch (error) {
      toast.error(error.response?.data?.message || 'Order Failed');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-serif text-primary mb-8 border-b border-gray-800 pb-4">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
            {/* Delivery address */}
            <div className="bg-dark-light rounded p-6 shadow-xl border border-gray-800 mb-8">
                <h2 className="text-xl text-white font-serif border-b border-gray-700 pb-2 mb-4">Shipping Address</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-400 mb-1 text-sm">Full Name</label>
                        <input 
                            className="input-field" 
                            placeholder="Enter receiver's name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1 text-sm">Phone Number</label>
                        <input 
                            className="input-field" 
                            placeholder="Enter 10-digit mobile number"
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1 text-sm">Full Address</label>
                        <textarea 
                            className="input-field resize-none h-24" 
                            placeholder="Enter your complete address (House No, Street, Landmark)"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1 text-sm">City (Currently restricted)</label>
                        <input className="input-field bg-dark text-gray-500 cursor-not-allowed" value={city} disabled />
                        <span className="text-xs text-primary mt-1 block">Delivery available only in Kakinada</span>
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1 text-sm">Postal Code</label>
                        <input 
                            className="input-field" 
                            placeholder="Eg: 533001" 
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Payment Method */}
            <div className="bg-dark-light rounded p-6 shadow-xl border border-gray-800">
                <h2 className="text-xl text-white font-serif border-b border-gray-700 pb-2 mb-4">Payment Method</h2>
                <div className="flex items-center gap-3 p-3 bg-dark border border-primary rounded text-white">
                    <input type="radio" checked readOnly className="h-4 w-4 text-primary bg-dark border-gray-600 focus:ring-primary focus:ring-2" />
                    <span>Cash on Delivery (COD)</span>
                </div>
            </div>
        </div>

        <div>
            {/* Order Summary sidebar */}
            <div className="bg-dark-light rounded p-6 shadow-xl border border-gray-800 sticky top-24">
                <h2 className="text-xl text-white font-serif border-b border-gray-700 pb-2 mb-4">Order Summary</h2>
                
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2 mb-6 scrollbar-thin scrollbar-thumb-gray-700">
                    {checkoutItems.map((item, index) => (
                        <div key={index} className="flex gap-4 items-center">
                            <img src={item.image} alt={item.productName} className="w-12 h-12 object-cover rounded" />
                            <div className="flex-1 text-sm">
                                <p className="text-white truncate w-40">{item.productName}</p>
                                <p className="text-gray-400">{item.qty} x ₹{item.price.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="font-bold text-white flex items-center">
                                <FaRupeeSign size={12}/> {(item.qty * item.price).toLocaleString('en-IN')}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-700 pt-4 space-y-3 mb-6 text-sm">
                    <div className="flex justify-between text-gray-300">
                        <span>Items</span>
                        <span><FaRupeeSign className="inline" size={12}/> {itemsPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                        <span>Shipping</span>
                        <span>{shippingPrice === 0 ? 'Free' : <><FaRupeeSign className="inline" size={12}/> {shippingPrice}</>}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-primary border-t border-gray-700 pt-3">
                        <span>Total:</span>
                        <span className="flex items-center"><FaRupeeSign size={18}/> {totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                </div>

                <button 
                  onClick={placeOrderHandler}
                  className="w-full btn-primary py-3 text-lg"
                >
                  Place Order
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
