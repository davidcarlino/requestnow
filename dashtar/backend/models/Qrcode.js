const mongoose = require('mongoose');

const qrSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',  // Refers to the 'Event' model
      required: true,
    },
    
  },
  {
    timestamps: true,
  }
)
const EventQrCode = mongoose.model('QrCode', qrSchema);
module.exports = EventQrCode;