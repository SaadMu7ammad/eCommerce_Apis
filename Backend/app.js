import express from 'express';
import dotenv from 'dotenv/config';
import productRoute from './routes/productRoutes.js';
import userRoute from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
const app = express();
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/products', productRoute);
app.use('/api/users', userRoute);
app.get('/api', (req, res, next) => {
  res.send('home');
});
app.use(notFound);
app.use(errorHandler);
await connectDB();
app.listen(process.env.PORT, () =>
  console.log('server is on port ' + process.env.PORT)
);
