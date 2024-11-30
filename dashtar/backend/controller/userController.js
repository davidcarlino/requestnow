const bcrypt = require("bcryptjs");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
const jwt = require("jsonwebtoken");
const { signInToken, tokenForVerify, sendEmail } = require("../config/auth");
const User = require("../models/User");

const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.send(users);
};

// get user by id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.send(user);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// add user
const addUser = async (req, res) => {
  console.log("add user....", req.body);
  try {
    const isAdded = await User.findOne({ email: req.body.email });
    if (isAdded) {
      return res.status(500).send({
        message: "This Email already Added!",
      });
    } else {
      const newUser = new User({
        name: req.body.name ,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
        phone: req.body.phone,
        joiningDate: req.body.joiningDate,
        role: req.body.role,
        image: req.body.image,
      });
      await newUser.save();
      res.status(200).send({
        message: "User Added Successfully!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
    // console.log("error", err);
  }
};

// update user
const updateUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (user) {
      user.name = { ...user.name, ...req.body.name };
      user.email = req.body.email;
      user.phone = req.body.phone;
      user.role = req.body.role;
      user.joiningData = req.body.joiningDate;
      // admin.password =
      //   req.body.password !== undefined
      //     ? bcrypt.hashSync(req.body.password)
      //     : admin.password;

      user.image = req.body.image;
      const updatedUser = await user.save();
      const token = signInToken(updatedUser);
      res.send({
        token,
        message: "Profile Updated Successfully!",
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        image: updatedUser.image,
      });
    } else {
      res.status(404).send({
        message: "This User not found!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = { getAllUsers, getUserById, addUser, updateUser };
