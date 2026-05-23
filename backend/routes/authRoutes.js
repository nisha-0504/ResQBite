const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
// 🔐 Generate Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    "secret", // must match authMiddleware
    { expiresIn: "1d" }
  );
};

// 📝 SIGNUP
router.post("/signup", async (req, res) => {
  try {
    console.log("SIGNUP BODY:", req.body);

    const { name, email, password, role } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      message: "User registered successfully",
      token, // 🔥 IMPORTANT
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// 🔑 LOGIN
router.post("/login", async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      token, // 🔥 THIS FIXES YOUR ISSUE
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});



// ✅ PROFILE ROUTE
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    console.log("USER ID FROM TOKEN:", req.user.id);

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    console.log("PROFILE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});
// ✅ UPDATE PROFILE
router.put(
  "/update-profile",
  authMiddleware,
  async (req, res) => {
    try {

      const user = await User.findById(
        req.user.id
      );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      user.name =
        req.body.name || user.name;

      user.email =
        req.body.email || user.email;

      user.phone =
        req.body.phone || user.phone;

      user.address =
        req.body.address || user.address;

      const updatedUser =
        await user.save();

      res.json({
        message: "Profile updated",
        user: updatedUser,
      });

    } catch (err) {
      console.log(
        "UPDATE PROFILE ERROR:",
        err
      );

      res.status(500).json({
        message: err.message,
      });
    }
  }
);
router.put(
  "/select-role",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { role: req.body.role },
        { new: true }
      );

      // generate NEW token with updated role
      const token = generateToken(user);

      res.json({
        message: "Role updated",
        token,
        user,
      });

    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);
module.exports = router;