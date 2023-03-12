const User = require('../models/userModels');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Get All users data

// module.exports.getAllUsers = async (req, res, next) => {
//   let users;
//   try {
//     users = await User.find();
//   } catch (err) {
//     return next(err);
//   }
//   if (!users) {
//     return res.status(400).json({ msg: 'No Users Found' });
//   }
//   return res.status(200).json({ users });
// };

//Signup Modules
module.exports.signup = async (req, res, next) => {
  //users data required
  const {
    firstName,
    middleName,
    lastName,
    dob,
    email,
    phone,
    password,
    occupation,
    company,
  } = req.body;
  let existingUser;
  try {
    //if there is a existing user or not find with email because it's unique
    existingUser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  //If the user is already exisit showing this message
  if (existingUser) {
    return res.status(200).json({ msg: 'User Already Exist' });
  }
  //No one cannot find the password so we using bcrypt to hashed the password and stored to the database
  const hashedPassword = bcrypt.hashSync(password, 10);
  //The user is Doesn't exisit creating new user id
  const user = new User({
    firstName,
    middleName,
    lastName,
    dob,
    email,
    phone,
    password: hashedPassword,
    occupation,
    company,
  });
  try {
    await user.save();
  } catch (err) {
    return console.log(err);
  }
  return res.status(201).json({ user });
};

//Login Modules
module.exports.login = async (req, res, next) => {
  //We using email,password to login the page
  const { email, password } = req.body;
  let existingUser;
  try {
    //only we find the email to find our user id
    existingUser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  //If there is a new user showing this message
  if (!existingUser) {
    return res.status(404).json({ msg: 'Please Signup Yourself!!!!' });
  }
  //this function is compare the user entered password to database stored password
  const isCorrectPassword = bcrypt.compareSync(password, existingUser.password);
  if (!isCorrectPassword) {
    return res.status(400).json({ msg: "Password Doesn't Match" });
  }
  //Token generation
  const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, {
    expiresIn: '2days',
  });
  //the user token send by a cookie to front-end
  res.cookie(String(existingUser._id), token, {
    path: '/',
    expires: new Date(Date.now() + 1000 * 30),
    httpOnly: true,
    sameSite: 'lax',
  });
//If successfully loged in showing the message with and user detail with token
  return res
    .status(200)
    .json({ msg: 'Successfully Loggedin', user: existingUser, token });
};
//this function is verify the users token
module.exports.verifyToken = async (req, res, next) => {
  const cookies = req.headers.cookie;
  const token = cookies.split('=')[1];
  console.log(token);
  if (!token) {
    res.status(404).json({ message: 'No Token Found' });
  }
  //jsonwebtoken will be verified with the secret key
  jwt.verify(String(token), process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(400).json({ message: 'Invalid Token' });
    }
    console.log(user.id);
    req.id = user.id;
  });
  next();
};
//if the token is ok get the users data
module.exports.getUser = async (req, res, next) => {
  const userId = req.id;
  let user;
  try {
    user = await User.findById(userId, '-password');
  } catch (err) {
    return new Error(err);
  }
  if (!user) {
    return res.status(404).json({ message: 'User Not Found' });
  }
  return res.status(200).json({ user });
};
