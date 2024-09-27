const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    paymentDetails: {
      type: String,
      required: true,
    },
    address: {
      type: Array,
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Refers to the 'Performer' model
      required: true,
    },
  },
  {
    timestamps: true,
  }
)
const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;