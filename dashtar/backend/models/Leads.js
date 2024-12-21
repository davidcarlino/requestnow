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
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    },
    notes: [{
      content: {
        type: String,
        default: '',
      },
      attachments: [{
        originalName: String,
        fileName: String,
        mimeType: String,
        size: Number,
        path: String
      }],
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
  },
  {
    timestamps: true,
  }
);

leadSchema.index({ createdBy: 1 });
const Leads = mongoose.model('Leads', leadSchema);
module.exports = Leads;
