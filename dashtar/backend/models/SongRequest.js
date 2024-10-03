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
    year: {
      type: String,
      required: true,
    },
    requestedBy: {
      type: String,
      required: false,
    },
    status: {
      type: Boolean,  // For integer values
      required: false,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',  // Refers to the 'Event' model
      required: false,
    },
    performer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Performer',  // Refers to the 'Performer' model
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Refers to the 'User' model
      required: false,
    },
  },
  {
    timestamps: true,
  }
)
const SongRequest = mongoose.model('SongRequest', songSchema);
module.exports = SongRequest;