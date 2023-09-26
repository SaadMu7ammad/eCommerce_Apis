import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import userModel from '../models/userModel.js';
import dotenv from 'dotenv/config';
const authentication = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;//coolkie-parser

  if (!token) throw new Error('you are not authenticated');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);//if token corrupted goes direct to the catch then to customError
    // if (!decoded) throw new Error({message:'token is corrupted'});
    req.user = await userModel.findById(decoded.userId).select('-password');//decoded.userId the decrypted user obj
    next();
  } catch (err) {
    res.status(401);
    //   console.log(err);
    throw new Error('token is corrupted');
    // throw new Error(err.message);
  }
});

  
//admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};
export { authentication, admin };
