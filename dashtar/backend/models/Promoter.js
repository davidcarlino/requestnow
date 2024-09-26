const mongoose = require('mongoose');

const promoterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    promoCode: {
      type: String,
      required: false,
    },
    qrCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QrCode',  // Refers to the 'QrCode' model
      required: true,
    },
  },
  {
    timestamps: true,
  }
)
const EventPromoter = mongoose.model('EventPromoter', promoterSchema);
module.exports = EventPromoter;