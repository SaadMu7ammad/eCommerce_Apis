import asyncHandler from '../middleware/asyncHandler.js';
import userModel from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
//@desc fetch login page
//@route POST /api/users/login
//@access public
const authUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const userObj = await userModel.findOne({ email: email });
  if (!userObj)
    throw new Error('email not found try with registered email plz');
  const isMatch = await userObj.matchPassword(password);
  if (isMatch) {
    generateToken(res, { id: userObj._id, name: userObj.name });

    const resUser = { ...userObj };
    delete resUser._doc.password;
    // console.log(resUser._doc);
    res.json(resUser._doc);
  } else {
    res.status(401);
    throw new Error('Not correct password');
  }
  //   res.status(200).json(user);
});

//@desc fetch resgister page
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const isExist = await userModel.findOne({ email: email });
  if (isExist) {
    res.status(400);
    throw new Error('email is used');
  }
  const userObj = await userModel.create(req.body);
  const resObj = { ...userObj._doc }
  delete resObj.password
  res.status(201).json(resObj);
});

//@desc fetch logout page/ clear cookie
//@route POST /api/users/logout
//@access private
const logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).send({ message: 'logout user successfully' });
});

//@desc fetch profile User page
//@route GET /api/users/profile
//@access private
const getUserProfile = asyncHandler(async (req, res, next) => {
  //   const user = await userModel.find({});
  res.send('profileUser ');
  //   res.status(200).json(user);
});
//@desc fetch profile User page
//@route PUT /api/users/profile
//@access private
const updateUserProfile = asyncHandler(async (req, res, next) => {
  //   const user = await userModel.find({});
  res.send('updateUserProfile ');
  //   res.status(200).json(user);
});
//@desc get user by id
//@route GET /api/users/:id
//@access private/admin
const getUserById = asyncHandler(async (req, res, next) => {
  const user = await userModel.find({});
  res.send(' user by id');
  //   res.status(200).json(user);
});

//@desc fetch all users
//@route GET /api/users/
//@access private/admin
const getUsers = asyncHandler(async (req, res, next) => {
  const user = await userModel.find({});
  res.send('all users');
  //   res.status(200).json(user);
});

//@desc update user
//@route PUT /api/users/:id
//@access private/admin
const updateUser = asyncHandler(async (req, res, next) => {
  const user = await userModel.find({});
  res.send('update User by id');
  //   res.status(200).json(user);
});
//@desc delete user
//@route DELETE /api/users/:id
//@access private/admin
const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await userModel.find({});
  res.send('delete user by id');
  //   res.status(200).json(user);
});
export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
