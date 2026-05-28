const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  restaurant: String,

  restaurantLocation: {
    address: String,
    latitude: Number,
    longitude: Number,
  },

  ngo: String,

  ngoLocation: {
    address: String,
    latitude: Number,
    longitude: Number,
  },

  distance: Number,
  quantity: Number,

  status: {
    type: String,
    enum: ["available", "accepted", "picked", "completed"],
    default: "available",
  },

  volunteerId: {
    type: String,
    default: null,
  },

  earnings: {
    type: Number,
    default: 0,
  },

  completedAt: Date,

  paid: {
    type: Boolean,
    default: false,
  },

  urgency: {
    type: String,
    default: "normal",
  },
});

module.exports = mongoose.model("Task", taskSchema);