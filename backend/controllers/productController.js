import Product from '../models/Product.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const keyword = req.query.keyword
      ? {
          productName: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};
      
    const category = req.query.category ? { category: req.query.category } : {};

    const products = await Product.find({ ...keyword, ...category }).sort({ createdAt: -1 });
    res.json(products);
  } catch(error) {
    next(error);
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch(error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch(error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const { productName, price, image, category, countInStock, description } = req.body;
    
    // Check if duplicate exists (Though index helps, we do explicit check for better error response)
    const productExists = await Product.findOne({ productName, category });
    if(productExists) {
        res.status(400);
        throw new Error('Product already exists in this category');
    }

    const product = new Product({
      productName: productName || 'Sample name',
      price: price || 0,
      user: req.user._id,
      image: image || '/images/sample.jpg',
      category: category || 'Bangles',
      stockQuantity: countInStock || 0,
      description: description || 'Sample description',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch(error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const { productName, price, description, image, category, stockQuantity } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      
      // If name or category changed, check for duplicate
      if(product.productName !== productName || product.category !== category) {
          const productExists = await Product.findOne({ productName, category });
          if(productExists && productExists._id.toString() !== product._id.toString()) {
              res.status(400);
              throw new Error('Another product with this name already exists in this category');
          }
      }

      product.productName = productName || product.productName;
      product.price = price || product.price;
      product.description = description || product.description;
      product.image = image || product.image;
      product.category = category || product.category;
      product.stockQuantity = stockQuantity !== undefined ? stockQuantity : product.stockQuantity;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch(error) {
    next(error);
  }
};

// @desc    Get all unique categories
// @route   GET /api/products/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch(error) {
    next(error);
  }
};
