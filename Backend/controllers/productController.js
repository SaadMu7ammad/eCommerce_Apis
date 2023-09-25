import asyncHandler from '../middleware/asyncHandler.js';
import productsModel from '../models/productModel.js';
//@desc fetch all products
//@route GET /api/products
//@access public
const getAllProducts = asyncHandler(async (req, res, next) => {
  // console.log('async 11');
  const products = await productsModel.find({});
  res.status(200).json(products);
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
export { getAllProducts,getProductById };
