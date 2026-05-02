const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  dob: String,
  age: Number,
  gender: String,
  vehicleType: { type: String, default: null },
});

module.exports = mongoose.model("User", userSchema);