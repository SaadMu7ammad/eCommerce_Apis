import asyncHandler from '../middleware/asyncHandler.js';
import orderModel from '../models/orderModel.js';
import mongoose from 'mongoose';
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
        _id:undefined,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
  //   {
  //     "user": "6512e379045f0f60330f801d",
  //     "orderItems": [
  //         {
  //             "name": "Product 1",
  //             "qty": 2,
  //             "image": "/images/product1.jpg",
  //             "price": 10,
  //             "product": "651205ad19758505d34c06d2",
  //             "_id": "65132c6660b3c736bb70b829"
  //         },
  //         {
  //             "name": "Product 2",
  //             "qty": 1,
  //             "image": "/images/product2.jpg",
  //             "price": 20,
  //             "product": "651205ad19758505d34c06d3",
  //             "_id": "65132c6660b3c736bb70b82a"
  //         }
  //     ],
  //     "shippingAddress": {
  //         "address": "123 Main St",
  //         "city": "Exampleville",
  //         "postalCode": "12345",
  //         "country": "Sampleland"
  //     },
  //     "paymentMethod": "Credit Card",
  //     "paymentResult": {
  //         "id": "payment_id",
  //         "status": "completed",
  //         "update_time": "2023-09-09T12:34:56Z",
  //         "email_address": "user@example.com"
  //     },
  //     "itemsPrice": 333,
  //     "taxPrice": 2,
  //     "shippingPrice": 50,
  //     "totalPrice": 385,
  //     "isPaid": true,
  //     "paidAt": "2023-09-09T14:00:00.000Z",
  //     "isDelivered": true,
  //     "deliveredAt": "2023-09-10T10:15:00.000Z",
  //     "_id": "65132c6660b3c736bb70b828",
  //     "createdAt": "2023-09-26T19:09:26.863Z",
  //     "updatedAt": "2023-09-26T19:09:26.863Z",
  //     "__v": 0
  // }
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
  const order = await orderModel.findById(req.params.id)
  if (!order) {
    res.status(404)
    throw new Error('order not founded')
  }
  order.isPaid = true
  order.paidAt = Date.now()
  order.paymentMethod = {
    id: req.body._id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address:req.body.payer.email_address
  }
  const updateOrder = await order.save()
  
  res.status(200).json(updateOrder)});

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
