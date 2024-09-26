const mongoose = require('mongoose');

const performerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    contactInfo: {
      type: String,
      required: true,
    },
    genres: {
      type: String,
      required: false,
    },
    rating: {
      type: Number,  // For integer values
      required: false,
    },
    profileImage: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    eventManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EventManager',  // Refers to the 'EventManager' model
      required: true,
    },
  },
  {
    timestamps: true,
  }
)
const Performer = mongoose.model('Performer', performerSchema);
module.exports = Performer;