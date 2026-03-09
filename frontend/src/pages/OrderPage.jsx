import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { FaRupeeSign, FaCheckCircle, FaClock, FaTruck } from 'react-icons/fa';

const OrderPage = () => {
  const { id } = useParams();
  const { userInfo } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get(`/api/orders/${id}`, config);
        setOrder(data);
        setLoading(false);
      } catch (error) {
        toast.error('Error fetching order');
        setLoading(false);
      }
    };
    if(userInfo) fetchOrder();
  }, [id, userInfo]);

  if (loading) return <Loader />;
  if (!order) return <div className="text-center text-white text-xl mt-12">Order Not Found</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-serif text-primary mb-2">Order {order._id}</h1>
      <p className="text-gray-400 mb-8 border-b border-gray-800 pb-4">
        Placed on {new Date(order.createdAt).toLocaleDateString()}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping */}
          <div className="bg-dark-light rounded p-6 border border-gray-800 shadow-lg">
            <h2 className="text-xl font-serif text-white mb-4">Shipping</h2>
            <p className="text-gray-300 mb-2">
              <strong>Account Name: </strong> {order.user.name}
            </p>
            <p className="text-gray-300 mb-4">
              <strong>Account Email: </strong> {order.user.email}
            </p>
            <p className="text-gray-300 mb-2">
              <strong>Receiver Name: </strong> {order.shippingAddress.fullName || order.user.name}
            </p>
            <p className="text-gray-300 mb-2">
              <strong>Phone Number: </strong> {order.shippingAddress.phoneNumber || 'Not Provided'}
            </p>
            <p className="text-gray-300 mb-4">
              <strong>Delivery Address: </strong>
              {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            
            {order.status === 'Delivered' ? (
              <div className="bg-green-900/30 text-green-400 p-3 rounded flex items-center gap-2 border border-green-900">
                <FaCheckCircle /> Delivered on {new Date(order.deliveredAt).toLocaleString()}
              </div>
            ) : order.status === 'Shipped' ? (
              <div className="bg-blue-900/30 text-blue-400 p-3 rounded flex items-center gap-2 border border-blue-900">
                <FaTruck /> Shipped
              </div>
            ) : (
                <div className="bg-yellow-900/30 text-yellow-400 p-3 rounded flex items-center gap-2 border border-yellow-900">
                <FaClock /> Processing
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-dark-light rounded p-6 border border-gray-800 shadow-lg">
            <h2 className="text-xl font-serif text-white mb-4">Payment Method</h2>
            <p className="text-gray-300 mb-4">
              <strong>Method: </strong> {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <div className="bg-green-900/30 text-green-400 p-3 rounded flex items-center gap-2 border border-green-900">
                <FaCheckCircle /> Paid on {new Date(order.paidAt).toLocaleString()}
              </div>
            ) : (
              <div className="bg-red-900/30 text-red-400 p-3 rounded flex items-center gap-2 border border-red-900">
                <FaClock /> Not Paid (Pay on Delivery)
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-dark-light rounded p-6 border border-gray-800 shadow-lg">
            <h2 className="text-xl font-serif text-white mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex gap-4 items-center border-b border-gray-800 pb-4 last:border-0 last:pb-0">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <Link to={`/product/${item.product}`} className="text-primary hover:underline font-serif">
                      {item.name}
                    </Link>
                  </div>
                  <div className="text-gray-300 text-sm">
                    {item.qty} x ₹{item.price.toLocaleString('en-IN')}
                  </div>
                  <div className="text-white font-bold flex items-center w-24 justify-end">
                    <FaRupeeSign size={14}/> {(item.qty * item.price).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary side display */}
        <div>
          <div className="bg-dark-light rounded p-6 border border-gray-800 shadow-lg sticky top-24">
            <h2 className="text-xl font-serif text-white mb-6 border-b border-gray-700 pb-4">Order Summary</h2>
            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Items</span>
                <span><FaRupeeSign className="inline" size={12}/> {order.itemsPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span><FaRupeeSign className="inline" size={12}/> {order.shippingPrice}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-primary border-t border-gray-700 pt-4">
                <span>Total</span>
                <span className="flex items-center"><FaRupeeSign size={18}/> {order.totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
