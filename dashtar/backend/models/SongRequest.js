const mongoose = require('mongoose');

const songSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    album: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: Date,  // Changed to Date for better date handling
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    requestedBy: {
      type: String,
      required: false,
    },
    status: {
      type: Boolean,  // Status for indicating the request status
      required: false,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',  // Refers to the Event model
      required: false,
    },
    performer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Performer',  // Refers to the Performer model
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Refers to the User model
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const SongRequest = mongoose.model('SongRequest', songSchema);
module.exports = SongRequest;
