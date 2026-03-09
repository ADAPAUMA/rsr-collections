import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import { FaBoxOpen, FaClipboardList, FaRupeeSign, FaUsers } from 'react-icons/fa';

const AdminDashboard = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalOrders: 0, totalSales: 0, totalProducts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data } = await API.get('/api/orders/analytics', config);
        setStats(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [userInfo, navigate]);

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif text-primary mb-8 border-b border-gray-800 pb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Total Sales */}
        <div className="bg-dark-light rounded p-6 shadow-xl border border-gray-800 flex items-center gap-6 group hover:border-primary transition-colors">
          <div className="bg-primary/20 p-4 rounded-full text-primary">
             <FaRupeeSign size={32} />
          </div>
          <div>
            <h3 className="text-gray-400 text-sm uppercase font-bold tracking-wider mb-1">Total Sales</h3>
            <div className="text-3xl font-serif text-white font-bold tracking-tight">
              ₹{stats.totalSales.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-dark-light rounded p-6 shadow-xl border border-gray-800 flex items-center gap-6 group hover:border-primary transition-colors">
          <div className="bg-blue-500/20 p-4 rounded-full text-blue-500">
             <FaClipboardList size={32} />
          </div>
          <div>
            <h3 className="text-gray-400 text-sm uppercase font-bold tracking-wider mb-1">Total Orders</h3>
            <div className="text-3xl font-serif text-white font-bold tracking-tight">
              {stats.totalOrders}
            </div>
            <Link to="/admin/orders" className="text-blue-500 text-sm hover:underline mt-1 block">View details →</Link>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-dark-light rounded p-6 shadow-xl border border-gray-800 flex items-center gap-6 group hover:border-primary transition-colors">
          <div className="bg-green-500/20 p-4 rounded-full text-green-500">
             <FaBoxOpen size={32} />
          </div>
          <div>
            <h3 className="text-gray-400 text-sm uppercase font-bold tracking-wider mb-1">Products</h3>
            <div className="text-3xl font-serif text-white font-bold tracking-tight">
              {stats.totalProducts}
            </div>
            <Link to="/admin/products" className="text-green-500 text-sm hover:underline mt-1 block">Manage inventory →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
