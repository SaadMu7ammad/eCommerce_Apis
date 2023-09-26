import express from 'express';
import {
  authUser,
  logoutUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  updateUser,
  getUserById,
} from '../controllers/userController.js';
import { admin, authentication } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(authentication, admin, getUsers).post(registerUser);//getUsers for admin ONLY
router
  .route('/profile')
  .get(authentication, getUserProfile)
  .put(authentication, updateUserProfile);
router
  .route('/:id')
  .get(authentication, admin, getUserById)
  .delete(authentication, admin, deleteUser)
  .put(authentication, admin, updateUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
export default router;
