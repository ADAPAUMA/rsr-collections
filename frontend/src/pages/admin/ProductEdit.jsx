import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import API from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaCloudUploadAlt, FaImage } from 'react-icons/fa';

const CATEGORIES = ['Bangles', 'Chains', 'Rings', 'Earrings', 'Jewelry Accessories'];

// Cloudinary unsigned upload - no backend needed
// User must create an unsigned upload preset named 'rsr-collections-upload' in Cloudinary dashboard
const CLOUDINARY_CLOUD_NAME = 'uma';
const CLOUDINARY_UPLOAD_PRESET = 'rsr_unsigned';

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
        const { data } = await API.get(`/api/products/${id}`);
        setProductName(data.productName);
        setPrice(data.price);
        setImage(data.image);
        setCategory(data.category || 'Bangles');
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

  // Upload directly from browser to Cloudinary using unsigned preset
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'rsr-collections');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await response.json();
      if (data.secure_url) {
        setImage(data.secure_url);
        toast.success('✅ Image uploaded successfully!');
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (error) {
      toast.error('Image upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error('Please upload a product image first');
      return;
    }
    try {
      await API.put(
        `/api/products/${id}`,
        { productName, price, image, category, description, stockQuantity },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success('✅ Product updated successfully!');
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
              <label className="block text-gray-400 mb-2">Product Name <span className="text-red-400">*</span></label>
              <input type="text" required className="input-field"
                placeholder="e.g. Gold Bridal Bangle"
                value={productName} onChange={(e) => setProductName(e.target.value)} />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Price (in ₹) <span className="text-red-400">*</span></label>
              <input type="number" required min="0" className="input-field"
                placeholder="e.g. 15000"
                value={price} onChange={(e) => setPrice(Number(e.target.value))} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 mb-2">Category <span className="text-red-400">*</span></label>
              <select required className="input-field"
                value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Stock Quantity <span className="text-red-400">*</span></label>
              <input type="number" required min="0" className="input-field"
                value={stockQuantity} onChange={(e) => setStockQuantity(Number(e.target.value))} />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Description <span className="text-red-400">*</span></label>
            <textarea required className="input-field h-32 resize-none"
              placeholder="Describe the product..."
              value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          {/* Image Upload - Direct to Cloudinary */}
          <div>
            <label className="block text-gray-400 mb-3">Product Image <span className="text-red-400">*</span></label>
            <div className="border-2 border-dashed border-gray-600 hover:border-primary rounded-lg p-6 transition-colors">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-36 h-36 flex-shrink-0 rounded-lg border border-gray-700 bg-dark flex items-center justify-center overflow-hidden">
                  {image ? (
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <FaImage className="text-gray-600 text-4xl" />
                  )}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <FaCloudUploadAlt className="text-primary text-4xl mx-auto md:mx-0 mb-3" />
                  <p className="text-white font-medium mb-1">Upload product image to Cloudinary</p>
                  <p className="text-gray-500 text-sm mb-4">Supports: JPG, PNG, WEBP (Max 10MB)</p>
                  <label htmlFor="image-upload" className="cursor-pointer btn-outline py-2 px-6 inline-block">
                    {uploading ? 'Uploading...' : 'Choose Image'}
                  </label>
                  <input id="image-upload" type="file"
                    accept="image/jpg,image/jpeg,image/png,image/webp"
                    onChange={uploadFileHandler}
                    className="hidden" disabled={uploading} />
                </div>
              </div>
              {uploading && (
                <div className="mt-4 flex items-center gap-2 text-primary">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
                  <span className="text-sm">Uploading to Cloudinary...</span>
                </div>
              )}
              {image && !uploading && (
                <p className="mt-3 text-green-400 text-sm truncate">✅ Image ready</p>
              )}
            </div>
          </div>

          <button type="submit" className="btn-primary py-3 px-8 text-lg w-full md:w-auto">
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductEdit;
