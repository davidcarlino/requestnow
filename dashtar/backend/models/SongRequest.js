const mongoose = require('mongoose');

const songSchema = new mongoose.Schema(
  {
    songName: {
      type: String,
      required: true,
    },
    artistName: {
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
      required: true,
    },
    performer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Performer',  // Refers to the 'Performer' model
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Refers to the 'User' model
      required: true,
    },
  },
  {
    timestamps: true,
  }
)
const SongRequest = mongoose.model('Performer', songSchema);
module.exports = SongRequest;