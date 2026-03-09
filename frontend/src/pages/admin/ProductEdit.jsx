import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);

  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Bangles');
  const [stockQuantity, setStockQuantity] = useState(0);
  const [description, setDescription] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }

    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProductName(data.productName);
        setPrice(data.price);
        setImage(data.image);
        setCategory(data.category);
        setStockQuantity(data.stockQuantity);
        setDescription(data.description);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error('Product not found');
      }
    };

    fetchProduct();
  }, [id, userInfo, navigate]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await axios.post('/api/upload', formData, config);
      setImage(data);
      setUploading(false);
      toast.success('Image uploaded successfully');
    } catch (error) {
      setUploading(false);
      toast.error('Image upload failed');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(
        `/api/products/${id}`,
        { productName, price, image, category, description, stockQuantity },
        config
      );
      toast.success('Product updated');
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link to="/admin/products" className="text-gray-400 hover:text-primary flex items-center gap-2 mb-8 transition-colors w-fit">
        <FaArrowLeft /> Go Back
      </Link>

      <div className="bg-dark-light rounded p-8 border border-gray-800 shadow-xl">
        <h1 className="text-3xl font-serif text-primary mb-8 border-b border-gray-700 pb-4">Edit Product</h1>

        <form onSubmit={submitHandler} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 mb-2">Name</label>
              <input 
                type="text" 
                className="input-field" 
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Price (in ₹)</label>
              <input 
                type="number" 
                className="input-field" 
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
              <label className="block text-gray-400 mb-2">Category</label>
              <input 
                type="text" 
                className="input-field" 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter category"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Stock Quantity</label>
              <input 
                type="number" 
                className="input-field" 
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Description</label>
            <textarea 
              className="input-field h-32 resize-none" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Image</label>
            <div className="flex flex-col gap-4">
               <input 
                type="text" 
                className="input-field bg-dark text-gray-500" 
                value={image}
                disabled
              />
              <input type="file" id="image-file" onChange={uploadFileHandler} className="text-gray-400" />
              {uploading && <Loader />}
              
              {image && (
                 <img src={image} alt="Preview" className="w-32 h-32 object-cover rounded border border-gray-700 mt-2" />
              )}
            </div>
          </div>

          <button type="submit" className="btn-primary py-3 px-8 text-lg w-full md:w-auto mt-8">
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductEdit;
