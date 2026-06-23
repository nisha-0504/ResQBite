const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  dob: String,
  age: Number,
  gender: String,
  vehicleType: { type: String, default: null },
  phone: {
    type: String,
    default: "Not Added",
  },
 role: {
  type: String,
  enum: ["donor", "ngo", "volunteer"],
  required: false,
},
  address: {
    type: String,
    default: "Not Added",
  },
});

module.exports = mongoose.model("User", userSchema);
