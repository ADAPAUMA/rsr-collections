import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import { FaTimes, FaRupeeSign, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';

const OrderList = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await API.get('/api/orders', config);
      setOrders(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [userInfo, navigate]);

  const updateStatusHandler = async (id, status) => {
    try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await API.put(`/api/orders/${id}/status`, { status }, config);
        toast.success(`Order marked as ${status}`);
        fetchOrders();
    } catch(err) {
        toast.error('Failed to update status');
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await API.delete(`/api/orders/${id}`, config);
        toast.success('Order deleted successfully');
        fetchOrders();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete order');
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif text-primary mb-8 border-b border-gray-800 pb-4">Orders Management</h1>

      <div className="bg-dark-light rounded border border-gray-800 overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-dark text-primary font-serif border-b border-gray-800">
                <th className="p-4">ID</th>
                <th className="p-4">USER</th>
                <th className="p-4">DATE</th>
                <th className="p-4">ADDRESS</th>
                <th className="p-4">TOTAL</th>
                <th className="p-4">PAID</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-center">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b border-gray-800 hover:bg-dark-light/50 transition-colors">
                <td className="p-4 text-sm text-gray-400 font-mono">...{order._id.substring(order._id.length - 6)}</td>
                <td className="p-4 text-white text-sm">
                  {order.user ? order.user.name : 'Unknown User'}
                  {order.shippingAddress?.phoneNumber && (
                    <span className="block text-xs text-gray-500">{order.shippingAddress.phoneNumber}</span>
                  )}
                </td>
                <td className="p-4 text-gray-300 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-gray-300 text-sm max-w-[200px] truncate" title={`${order.shippingAddress?.address || ''}, ${order.shippingAddress?.city || ''}`}>
                  {order.shippingAddress?.address || 'N/A'}, {order.shippingAddress?.city || ''}
                </td>
                <td className="p-4 text-gray-300 text-sm">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                <td className="p-4 text-sm">
                  {order.isPaid ? (
                     <FaCheck className="text-green-500" />
                  ) : (
                     <FaTimes className="text-red-500" />
                  )}
                </td>
                <td className="p-4 text-sm">
                    {order.status === 'Delivered' ? (
                       <span className="text-green-500 font-bold bg-green-900/20 px-2 py-1 rounded">Delivered</span>
                    ) : order.status === 'Shipped' ? (
                       <span className="text-blue-500 font-bold bg-blue-900/20 px-2 py-1 rounded">Shipped</span>
                    ) : (
                       <span className="text-yellow-500 font-bold bg-yellow-900/20 px-2 py-1 rounded">Pending</span>
                    )}
                </td>
                <td className="p-4 flex flex-col gap-2 items-center">
                  <Link to={`/order/${order._id}`} className="text-primary hover:underline text-sm font-bold">
                    Details
                  </Link>
                  {order.status === 'Pending' && (
                      <button onClick={() => updateStatusHandler(order._id, 'Shipped')} className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded w-full">Mark Shipped</button>
                  )}
                  {order.status === 'Shipped' && (
                      <button onClick={() => updateStatusHandler(order._id, 'Delivered')} className="text-xs bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded w-full">Mark Delivered</button>
                  )}
                  <button onClick={() => deleteHandler(order._id)} className="text-xs bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded w-full mt-2 flex items-center justify-center gap-1">
                      <FaTimes /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
