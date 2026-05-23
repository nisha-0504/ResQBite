const User = require("../models/User");
const jwt = require("jsonwebtoken");

// 🔐 Generate Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    "secret", // must match authMiddleware
    { expiresIn: "1d" }
  );
};

// 📝 Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "Signup successful",
      token,
      user,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔑 Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // ⚠️ (simple check – no bcrypt for now)
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  // ✏️ Update Profile
exports.updateProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found" });
    }

    user.name =
      req.body.name || user.name;

    user.email =
      req.body.email || user.email;

    user.phone =
      req.body.phone || user.phone;

    user.address =
      req.body.address || user.address;

    const updatedUser = await user.save();

    res.json({
      message: "Profile updated",
      user: updatedUser,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
};