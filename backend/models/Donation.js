const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    // --- Relations ---
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ngoId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // --- Donation details ---
    title: { type: String },
    description: String,
    foodType: String,
    quantity: { type: Number },        // keep as Number for calculations
    location: String,

    // --- Pickup / delivery info ---
    restaurant: String,
    ngo: String,
    distance: Number,

    // --- Status ---
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "assigned",
        "picked",
        "completed",
      ],
      default: "pending",
    },

    // --- Timestamps for flow ---
    pickupTime: Date,
    expiryTime: Date,
    pickedAt: Date,
    completedAt: Date,

    // --- Extras ---
    images: [String],
    earnings: Number,
    paid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);