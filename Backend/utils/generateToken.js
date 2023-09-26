import jwt from 'jsonwebtoken';
import dotenv from 'dotenv/config';
const generateToken = (res, user) => {
  const token = jwt.sign({userId:user.id,name:user.name}, process.env.JWT_SECRET, {
    expiresIn: process.env.COOKIE_DURATION,
  });
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV!=='development',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export default generateToken
