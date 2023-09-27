import path from 'path'
import express from 'express';
import dotenv from 'dotenv/config';
import productRoute from './routes/productRoutes.js';
import userRoute from './routes/userRoutes.js';
import orderRoute from './routes/orderRoutes.js';
import uploadRoute from './routes/uploadRoutes.js';
import cookieParser from 'cookie-parser';
const app = express();
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/products', productRoute);
app.use('/api/users', userRoute);
app.use('/api/orders', orderRoute);
app.use('/api/upload', uploadRoute)

app.get('/api/config/paypal', (req, res) => res.send({ clientId: process.env.PAYPAL_CLIENT_ID }))

const __dirname = path.resolve()//set dirname to the current directory
app.use('/uploads',express.static(path.join(__dirname,'/uploads')))
app.use(notFound);
app.use(errorHandler);
await connectDB();
app.listen(process.env.PORT, () =>
  console.log('server is on port ' + process.env.PORT)
);
