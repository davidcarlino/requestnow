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
    songRequest: [{
      type: mongoose.Schema.Types.ObjectId,  // Reference to the song model
      ref: 'SongRequest',
      required: false
    }],
    status: { 
      type: Boolean, 
      default: false 
    },
    eventCode: { 
      type: String, 
      default: false 
    }
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
