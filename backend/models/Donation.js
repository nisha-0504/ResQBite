const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  restaurant: String,
  ngo: String,
  quantity: Number,
  distance: Number,

  status: {
    type: String,
    enum: ["assigned", "picked", "completed"],
    default: "assigned"
  },

  pickedAt: Date,
  completedAt: Date,

  earnings: Number,
  paid: Boolean
});

module.exports = mongoose.model("Donation", donationSchema);