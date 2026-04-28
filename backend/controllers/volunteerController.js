const Donation = require("../models/Donation");

// CURRENT TASK
exports.getCurrentTask = async (req, res) => {
  const task = {
    _id: "test123",
    restaurant: "Pizza Hut",
    ngo: "Food NGO",
    quantity: 10,
    distance: 5,
    status: "assigned"
  };

  res.json(task);
};

// PICKUP
exports.pickupTask = async (req, res) => {
  const task = await Donation.findOneAndUpdate(
    { _id: req.params.id, volunteerId: req.user.id, status: "assigned" },
    { status: "picked", pickedAt: new Date() },
    { new: true }
  );

  res.json(task);
};

// COMPLETE
exports.completeTask = async (req, res) => {
  const task = await Donation.findOneAndUpdate(
    { _id: req.params.id, volunteerId: req.user.id, status: "picked" },
    {
      status: "completed",
      completedAt: new Date(),
      earnings: 50,
      paid: false
    },
    { new: true }
  );

  res.json(task);
};

// CANCEL
exports.cancelTask = async (req, res) => {
  const task = await Donation.findOneAndUpdate(
    { _id: req.params.id, volunteerId: req.user.id },
    {
      status: "assigned",
      volunteerId: null
    },
    { new: true }
  );

  res.json(task);
};

// HISTORY
exports.getHistory = async (req, res) => {
  const history = await Donation.find({
    volunteerId: req.user.id,
    status: "completed"
  }).sort({ completedAt: -1 });

  res.json(history);
};
