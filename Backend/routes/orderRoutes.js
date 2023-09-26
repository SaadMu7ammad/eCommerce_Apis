import express from 'express';
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
  getAllOrders,
} from '../controllers/orderController.js';
import { admin, authentication } from '../middleware/authMiddleware.js';
const router = express.Router();
router
  .route('/')
  .get( authentication,admin, getAllOrders)
  .post(authentication, addOrderItems);

router.route('/myorders').get(authentication, getMyOrders);
router.route('/:id').get(authentication,admin, getOrderById);
router.route('/:id/pay').put(authentication, updateOrderToPaid);
router.route('/:id/deliver').put( authentication,admin, updateOrderToDelivered);

export default router;
