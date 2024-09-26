const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    contactInfo: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    role: {
      type: String,  // For integer values
      required: false,
    },
    promoter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EventPromoter',  // Refers to the 'EventPromoter' model
      required: true,
    },
  },
  {
    timestamps: true,
  }
)
const EventManager = mongoose.model('EventManager', managerSchema);
module.exports = EventManager;