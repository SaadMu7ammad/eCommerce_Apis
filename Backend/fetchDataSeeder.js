import mongoose from 'mongoose';
// import dotenv from 'dotenv';

import users from './data/users.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import connectDB from './config/db.js';

connectDB();

const importData = async () => {
  try {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;
    // console.log("adminId "+adminUser);
    const sampleProducts = products.map((product) => {
      // console.log({ ...product});
      // console.log({ ...product, user: adminUser });
      return { ...product, user: adminUser }; //add  user: new ObjectId("650fe4312b4132a03e02e98c")
    });

    await Product.insertMany(sampleProducts);
  } catch (err) {
    console.log(err);
  }
};
importData();
// console.log(process.argv[2]);