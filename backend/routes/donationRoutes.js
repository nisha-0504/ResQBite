const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation");

// ADD DONATION
router.post("/add", async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    const donation = new Donation(req.body);
    await donation.save();

    res.status(201).json({
      success: true,
      message: "Donation added successfully",
    });
  } catch (error) {
    console.error("ERROR:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET ALL DONATIONS
router.get("/", async (req, res) => {
  try {
    const donations = await Donation.find();
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;