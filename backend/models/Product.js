import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
  productName: { type: String, required: true },
  category: { 
    type: String, 
    required: true
  },
  price: { type: Number, required: true, default: 0 },
  description: { type: String, required: true },
  image: { type: String, required: true },
  stockQuantity: { type: Number, required: true, default: 0 },
}, { timestamps: true });

// Prevent duplicate product based on name and category combination
productSchema.index({ productName: 1, category: 1 }, { unique: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
