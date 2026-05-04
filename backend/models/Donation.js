<<<<<<< HEAD
// models/Donation.js
const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  title: { type: String, required: true },
  description: String,
  foodType: String,
  quantity: String,
  location: String,

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "picked", "completed"],
    default: "pending"
  }
}, { timestamps: true });
=======
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
>>>>>>> origin/pnithya

module.exports = mongoose.model("Donation", donationSchema);