const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    contactInfo: {
      type: String,
      required: false,
    },
    capacity: {
      type: Number,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Venue = mongoose.model('Venue', venueSchema);
module.exports = Venue;
