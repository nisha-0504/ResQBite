const Donation = require("../models/Donation");

// 1. Get all available food
exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ status: "pending" });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Accept (claim)
exports.acceptDonation = async (req, res) => {
  try {
    const { id } = req.params;

    const donation = await Donation.findById(id);

    if (!donation) {
      return res.status(404).json({ message: "Not found" });
    }

    donation.status = "accepted";
    await donation.save();

    res.json({ message: "Donation accepted", donation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};