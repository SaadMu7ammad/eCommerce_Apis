import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,createProductReview
} from '../controllers/productController.js';

import { admin, authentication } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';
const router = express.Router();
router.route('/').get(getAllProducts).post(authentication,admin,createProduct);

router.route('/:id').get(checkObjectId,getProductById).put(authentication,admin,checkObjectId,updateProduct).delete(authentication,admin,checkObjectId,deleteProduct);;

router.route('/:id/reviews').post(authentication,checkObjectId,createProductReview);;

export default router;
