import asyncHandler from '../middleware/asyncHandler.js';
import orderModel from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { calcPrices } from '../utils/calcPrices.js';
import { verifyPayPalPayment, checkIfNewTransaction } from '../utils/paypal.js';
import mongoose from 'mongoose';
//@desc create new order
//@route POST /api/orders
//@access private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    // get the ordered items from our database
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    // map over the order items and use the price from our items from database
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );
      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    // calculate prices
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

//@desc get logged in user orders
//@route GET /api/orders/myorders
//@access private
const getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await orderModel.find({ user: req.user._id })
  res.status(200).json(orders)
});

//@desc get order by id
//@route GET /api/orders/:id
//@access private
const getOrderById = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id).populate('user','name email')
  if (!order) {
    res.status(404)
    throw new Error('order not founded')
  }
  res.status(200).json(order)
});

//@desc update order by id to be paid
//@route PUT /api/orders/:id/pay
//@access private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const { verified, value } = await verifyPayPalPayment(req.body.id);
  if (!verified) throw new Error('Payment not verified');

  // check if this transaction has been used before
  const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
  if (!isNewTransaction) throw new Error('Transaction has been used before');

  const order = await Order.findById(req.params.id);

  if (order) {
    // check the correct amount was paid
    const paidCorrectAmount = order.totalPrice.toString() === value;
    if (!paidCorrectAmount) throw new Error('Incorrect amount paid');

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

//@desc update order by id to be delivered
//@route PUT /api/orders/:id/deliver
//@access private
const updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  res.send('update my order by id to delivered');
});

//@desc get all orders by admin
//@route GET /api/orders
const getAllOrders = asyncHandler(async (req, res, next) => {
  res.send('all orders by an admin');
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getAllOrders,
};
