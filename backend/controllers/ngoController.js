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
    // save NGO ID
    donation.ngoId = req.user.id;
    await donation.save();

    res.json({ message: "Donation accepted", donation });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
        status: "accepted",
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