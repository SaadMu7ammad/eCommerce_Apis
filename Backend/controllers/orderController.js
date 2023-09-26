import asyncHandler from '../middleware/asyncHandler.js';
import orderModel from '../models/orderModel.js';
//@desc create new order
//@route POST /api/orders
//@access private
const addOrderItems = asyncHandler(async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('no order items');
  } else {
    const order = new orderModel({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id,
        _id: undefined,
      })),
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
const updateOrderToPaid = asyncHandler(async (req, res, next) => {
  res.send('update my order by id to paid');
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
