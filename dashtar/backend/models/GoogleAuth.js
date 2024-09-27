const mongoose = require('mongoose');

const authSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: Array,
      required: false,
    },
  },
  {
    timestamps: true,
  }
)
const Auth = mongoose.model('Auth', authSchema);
module.exports = Auth;