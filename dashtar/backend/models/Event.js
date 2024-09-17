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
    location: {
      type: String,
      required: false,
    },
    
  },
  {
    timestamps: true,
  }
);

// module.exports = categorySchema;

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
