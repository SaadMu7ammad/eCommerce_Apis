import asyncHandler from '../middleware/asyncHandler.js';
import productsModel from '../models/productModel.js';
//@desc fetch all products
//@route GET /api/products
//@access public
const getAllProducts = asyncHandler(async (req, res, next) => {
  const pageSize = 2;
  const page = Number(req.query.pageNumber) || 1;
  const count = await productsModel.countDocuments();

  const products = await productsModel
    .find({})
    .limit(pageSize)
    .skip((page - 1) * pageSize);
  res.status(200).json({products,page,pages:Math.ceil(count/pageSize)});
  // console.log('async 22');
});
//@desc fetch product by id
//@route GET /api/products/:id
//@access public
const getProductById = asyncHandler(async (req, res, next) => {
  const product = await productsModel.findOne({ _id: req.params.id });
  if (!product) {
    throw new Error('not found product');
    //   res.status(404).json({ message: 'not Found Product' });
  }
  res.status(200).json(product);
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new productsModel({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  const createdProduct = await productsModel.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await productsModel.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await productsModel.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await productsModel.findById(req.params.id);

  if (product) {
    await productsModel.deleteOne({ _id: product._id });
    res.status(200).json({ message: 'product deleted' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    create a review
// @route   POST /api/products/:id/review
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await productsModel.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(404);
      throw new Error('product already reviewed');
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, rev) => acc + rev.rating, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});
export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
};
