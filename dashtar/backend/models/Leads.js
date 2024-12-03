const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      required: false,
    },
    service: {
      type: String,
      required: true,
      enum: ['wedding_dj', 'corporate_events', 'birthday_party', 'club_dj', 'private_events', 'concert_dj'],
    },
    rating: {
      type: String,
      required: true,
      enum: ['hot', 'warm', 'cold', 'not_qualified'],
    },
    status: {
      type: String,
      default: 'new',
      enum: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'],
    }
  },
  {
    timestamps: true,
  }
);

const Leads = mongoose.model('Leads', leadSchema);
module.exports = Leads;
