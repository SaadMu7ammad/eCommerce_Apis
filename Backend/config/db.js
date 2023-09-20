import mongoose from 'mongoose';
import dotenv from 'dotenv/config';

const connectDB = async () => {
  try {
    const dbconnect = await mongoose.connect(process.env.MONGO_URL);
    if (dbconnect) console.log('db connected on host '+dbconnect.connection.host);
  } catch (err) {
    // console.log(err);
    console.log('failed to connect to the db');
  }
};

export default connectDB;
