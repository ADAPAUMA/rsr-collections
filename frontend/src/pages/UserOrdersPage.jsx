import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import { FaEye, FaTimes } from 'react-icons/fa';

const UserOrdersPage = () => {
  const { userInfo } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if(!userInfo) {
        navigate('/login');
        return;
    }
    const fetchOrders = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await API.get('/api/orders/myorders', config);
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userInfo, navigate]);

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif text-primary mb-8 border-b border-gray-800 pb-4">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-dark-light p-8 rounded border border-gray-800 text-center text-gray-400">
          You haven't placed any orders yet.
          <Link to="/shop" className="text-primary hover:underline ml-2">Start Shopping</Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark-light text-primary font-serif border-b border-gray-800">
                <th className="p-4 rounded-tl-lg">ID</th>
                <th className="p-4">DATE</th>
                <th className="p-4">TOTAL</th>
                <th className="p-4">PAID</th>
                <th className="p-4">DELIVERED</th>
                <th className="p-4 rounded-tr-lg"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-gray-800 hover:bg-dark-light/50 transition-colors">
                  <td className="p-4 text-sm text-gray-300 font-mono">...{order._id.substring(order._id.length - 6)}</td>
                  <td className="p-4 text-sm text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-sm font-bold text-white">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-sm text-gray-300">
                    {order.isPaid ? (
                      <span className="text-green-500 bg-green-900/20 px-2 py-1 rounded text-xs">Paid</span>
                    ) : (
                      <span className="text-red-500 bg-red-900/20 px-2 py-1 rounded text-xs flex items-center w-max gap-1"><FaTimes /> No</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-300">
                    {order.status === 'Delivered' ? (
                      <span className="text-green-500 bg-green-900/20 px-2 py-1 rounded text-xs flex items-center w-max gap-1">Delivered</span>
                    ) : order.status === 'Shipped' ? (
                       <span className="text-blue-500 bg-blue-900/20 px-2 py-1 rounded text-xs flex items-center w-max gap-1">Shipped</span>
                    ) : (
                      <span className="text-yellow-500 bg-yellow-900/20 px-2 py-1 rounded text-xs flex items-center w-max gap-1">Processing</span>
                    )}
                  </td>
                  <td className="p-4">
                    <Link to={`/order/${order._id}`} className="text-primary hover:text-white transition-colors p-2 inline-block">
                      <FaEye size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserOrdersPage;
