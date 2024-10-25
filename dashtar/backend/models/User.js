const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false, // Not required for Google sign-in
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    picture: {
      type: String,
    },
    songRequest: {
      type: Array,
      required: false,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: false,
    },
    auth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auth',
      required: false,
    },
  },
  {
    timestamps: true,
  }
)
const User = mongoose.model('User', userSchema);
module.exports = User;
