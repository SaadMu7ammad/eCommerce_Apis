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
  try {
    const user = await userModel.findById(req.user._id);
    // if (!user) throw new Error('not found such a user')//will be catched in catch block
    const userRes = { ...user._doc }
    delete userRes.password
    res.status(200).json(userRes);
  }
  catch (err) {
    res.status(404)
    throw new Error('not found such a user')
  }
});
//@desc fetch profile User page
//@route PUT /api/users/profile
//@access private
const updateUserProfile = asyncHandler(async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    const { email, name, password } = req.body
    if(email)user.email=email
    if(name)user.name=name
    if (password) user.password = password
    let userRes=await user.save()
    if (!user) throw new Error('not found such a user')//will be catched in catch block
    userRes = { ...userRes._doc }
    delete userRes.password
    res.status(200).json(userRes);
  }
  catch (err) {
    res.status(404)
    // console.log(err.message);
    throw new Error('error happened email/user issues')
  }
});
//@desc get user by id
//@route GET /api/users/:id
//@access private/admin
const getUserById = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('user not found');
  }
  res.status(200).json(user); 
});

//@desc fetch all users
//@route GET /api/users/
//@access private/admin
const getUsers = asyncHandler(async (req, res, next) => {
  const users = await userModel.find({});
  res.status(200).json(users);
});

//@desc update user
//@route PUT /api/users/:id
//@access private/admin
const updateUser = asyncHandler(async (req, res, next) => {
  const { name, email, isAdmin } = req.body
  const user = await userModel.findById(req.params.id)
  if (!user) {
    res.status(404);
    throw new Error('user not found');
  }
  if(name)user.name=name
  if(email)user.email=email
  if (isAdmin) user.isAdmin =isAdmin==='true'?true:false
  const updatedUser = await user.save()
  const resUser = { ...updatedUser._doc }
  delete resUser.password
  res.status(200).json(resUser); 
});
//@desc delete user
//@route DELETE /api/users/:id
//@access private/admin
const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('user not found');
  }
  if (user.isAdmin) {
    res.status(404);
    throw new Error('cant delete admin user');
  }
  await userModel.deleteOne({ _id: user._id })
  res.status(200).json({message:'user deleted successfully'})
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
