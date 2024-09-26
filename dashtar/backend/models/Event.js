const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    startTime: {
      type: String,
      required: false,
    },
    endTime: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      required: false,
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,  // Reference to the Venue model
      ref: 'Venue',
      required: true
    },
    status: { 
      type: Boolean, 
      default: false 
    }
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
