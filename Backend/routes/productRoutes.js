import express from 'express';

import productsModel from '../models/productModel.js';
import asyncHandler from '../middleware/asyncHandler.js';
const route = express.Router();
route.get(
  '/',
  asyncHandler(async (req, res, next) => {
    // console.log('async 11');
    const products = await productsModel.find({});
      res.status(200).json(products);
    // console.log('async 22');
  })
);

route.get(
  '/:id',
  asyncHandler(async (req, res, next) => {
    const product = await productsModel.findOne({ _id: req.params.id });
      if (!product) {
        throw new Error('not found product')
    //   res.status(404).json({ message: 'not Found Product' });
    }
    res.status(200).json(product);
  })
);
export default route;
