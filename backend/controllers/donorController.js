// controllers/donorController.js
const Donation = require("../models/Donation");

// ✅ Create Donation
exports.createDonation = async (req, res) => {
  try {
    const donation = await Donation.create({
      donorId: req.user.id,
      title: req.body.title,
      description: req.body.description,
      foodType: req.body.foodType,
      quantity: req.body.quantity,
      location: req.body.location
    });

    res.status(201).json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get My Donations
exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donorId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get Single Donation (optional but useful)
exports.getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findOne({
      _id: req.params.id,
      donorId: req.user.id
    });

    if (!donation) return res.status(404).json({ message: "Not found" });

    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update Donation (only if still pending)
exports.updateDonation = async (req, res) => {
  try {
    const donation = await Donation.findOne({
      _id: req.params.id,
      donorId: req.user.id
    });

    if (!donation) return res.status(404).json({ message: "Not found" });

    if (donation.status !== "pending") {
      return res.status(400).json({ message: "Cannot edit after acceptance" });
    }

    Object.assign(donation, req.body);
    await donation.save();

    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete Donation
exports.deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findOneAndDelete({
      _id: req.params.id,
      donorId: req.user.id,
      status: "pending"
    });

    if (!donation) {
      return res.status(400).json({ message: "Cannot delete this donation" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};