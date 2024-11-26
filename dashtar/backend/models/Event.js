const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    },
    startTime: {
      type: Date,
      required: false,
    },
    endTime: {
      type: Date,
      required: false,
    },
    slug: {
      type: String,
      required: false,
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
      required: true
    },
    songRequests: [{
      type: mongoose.Schema.Types.ObjectId,
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

// Add indexes for better query performance
eventSchema.index({ createdBy: 1 });
eventSchema.index({ name: 1 });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
