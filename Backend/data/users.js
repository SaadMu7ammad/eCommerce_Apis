import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'saad mo',
    email: 'saad@email.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'saul momo',
    email: 'saul@email.com',
    password: bcrypt.hashSync('123456', 10),
  },
];

export default users;