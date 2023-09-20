import express from 'express';
import dotenv from 'dotenv/config';
const app = express();
import connectDB from './config/db.js';
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
  res.send('home');
});
await connectDB();
app.listen(process.env.PORT, () =>
  console.log('server is on port ' + process.env.PORT)
);
