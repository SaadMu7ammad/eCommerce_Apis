import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,createProductReview
} from '../controllers/productController.js';
import { admin, authentication } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route('/').get(getAllProducts).post(authentication,admin,createProduct);

router.route('/:id').get(getProductById).put(authentication,admin,updateProduct).delete(authentication,admin,deleteProduct);;

router.route('/:id/reviews').post(authentication,createProductReview);;

export default router;
