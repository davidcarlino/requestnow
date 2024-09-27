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
    },
    songRequest: {
      type: Array,
      required: false,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',  // Refers to the 'Admin' model
      required: true,
    },
    auth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auth',  // Refers to the 'Performer' model
      required: true,
    },
  },
  {
    timestamps: true,
  }
)
const User = mongoose.model('User', userSchema);
module.exports = User;