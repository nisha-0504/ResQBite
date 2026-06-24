const Donation = require("../models/Donation");
const { getDistance } = require("geolib");

// 1. Get all available food
exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ status: "pending" });
    console.log(
      "AVAILABLE DONATIONS:",
      donations
    );
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

    const User = require("../models/User");
    const ngoUser = await User.findById(req.user.id);



    donation.status = "accepted";

    donation.ngoId = req.user.id;

    donation.ngo =
      ngoUser?.name || "NGO";

    donation.ngoAddress =
      ngoUser?.address || "";
    const distance =
      Math.floor(Math.random() * 8) + 2;

    const earnings =
      20 + distance * 5;

    donation.distance = distance;
    donation.earnings = earnings;

    await donation.save();

    res.json({ message: "Donation accepted", donation });
  } catch (err) {

    console.log(
      "ACCEPT ERROR:",
      err
    );

    res.status(500).json({
      error: err.message
    });
  }
};
// 3. Get accepted donations for NGO
exports.getActiveDonations = async (
  req,
  res
) => {
  try {

    const donations =
      await Donation.find({
        ngoId: req.user.id,
        status: { $in: ["accepted", "assigned", "picked"] },
      }).sort({
        createdAt: -1,
      });

    res.json(donations);

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
// 4. NGO history
exports.getHistory = async (
  req,
  res
) => {

  try {

    const donations =
      await Donation.find({
        ngoId: req.user.id,
        status: "completed",
      }).sort({
        updatedAt: -1,
      });

    res.json(donations);

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });
  }
};

// 5. Get donation by ID (populated for NGO tracking)
exports.getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate("ngoId");
    if (!donation) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(donation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};