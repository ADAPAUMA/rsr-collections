import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import { FaEdit, FaTrash, FaPlus, FaImage } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ProductList = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
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
    fetchProducts();
  }, [userInfo, navigate]);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`/api/products/${id}`, config);
        toast.success('Product deleted');
        fetchProducts(); // Refresh
      } catch (error) {
        toast.error(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  const createProductHandler = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post('/api/products', {}, config);
      navigate(`/admin/product/edit/${data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Create failed');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-serif text-primary">Products</h1>
        <button className="btn-primary flex items-center gap-2" onClick={createProductHandler}>
          <FaPlus /> Create Product
        </button>
      </div>

      <div className="bg-dark-light rounded border border-gray-800 overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-dark text-primary font-serif border-b border-gray-800">
                <th className="p-4">ID</th>
                <th className="p-4">IMAGE</th>
                <th className="p-4">NAME</th>
                <th className="p-4">PRICE</th>
                <th className="p-4">CATEGORY</th>
                <th className="p-4">STOCK</th>
                <th className="p-4 text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b border-gray-800 hover:bg-dark-light/50 transition-colors">
                <td className="p-4 text-sm text-gray-400 font-mono">...{product._id.substring(product._id.length - 6)}</td>
                <td className="p-4">
                  {product.image ? (
                     <img src={product.image} alt={product.productName} className="w-12 h-12 object-cover rounded border border-gray-700"/>
                  ) : (
                      <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center text-gray-500">
                          <FaImage />
                      </div>
                  )}
                </td>
                <td className="p-4 text-white font-medium">{product.productName}</td>
                <td className="p-4 text-gray-300">₹{product.price.toLocaleString('en-IN')}</td>
                <td className="p-4 text-gray-300">{product.category}</td>
                <td className="p-4 text-gray-300">
                    {product.stockQuantity > 0 ? (
                        <span className="text-green-400 font-bold">{product.stockQuantity}</span>
                    ) : (
                        <span className="text-red-400 bg-red-900/20 px-2 py-1 rounded text-xs">Out of Stock</span>
                    )}
                </td>
                <td className="p-4 text-center space-x-3">
                  <Link to={`/admin/product/edit/${product._id}`} className="text-blue-500 hover:text-blue-400 inline-block">
                    <FaEdit size={18} />
                  </Link>
                  <button className="text-red-500 hover:text-red-400 inline-block" onClick={() => deleteHandler(product._id)}>
                    <FaTrash size={18} />
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

export default ProductList;
