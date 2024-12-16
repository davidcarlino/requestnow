const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    },
    setting: {},
  },
  {
    timestamps: true,
  }
);

// Create compound unique index for name + adminId
settingSchema.index({ name: 1, adminId: 1 }, { unique: true });

const Setting = mongoose.model("Setting", settingSchema);

module.exports = Setting;
