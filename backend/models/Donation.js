const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    foodName: String,
    quantity: String,
    expiryTime: String,
    pickupLocation: String,
    donorName: String,
    donorContact: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);