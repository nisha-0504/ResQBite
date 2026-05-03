const Task = require("../models/Task");
const mongoose = require("mongoose"); // ➕ ADD

// 📌 CURRENT TASK (ONLY ACTIVE)
exports.getCurrentTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      status: { $in: ["accepted", "picked"] },
      volunteerId: new mongoose.Types.ObjectId(req.user.id)
    });


    res.json(task || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// 📌 AVAILABLE TASKS (MULTIPLE)
exports.getAvailableTasks = async (req, res) => {
  const tasks = await Task.find({ status: "available" });
  res.json(tasks);
};

// 📌 HISTORY
exports.getHistory = async (req, res) => {
  try {
    const tasks = await Task.find({
      status: "completed",
      volunteerId: new mongoose.Types.ObjectId(req.user.id)
    }).sort({ completedAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// 📌 ACCEPT + PICKUP
exports.pickupTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: "Not found" });

    if (task.status === "available") {
      task.status = "accepted";

      task.volunteerId = new mongoose.Types.ObjectId(req.user.id); // ✅ FIX
    } else if (task.status === "accepted") {
      task.status = "picked";
    }

    await task.save();

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// 📌 COMPLETE
exports.completeTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        volunteerId: new mongoose.Types.ObjectId(req.user.id)
      },
      {
        status: "completed",
        completedAt: new Date(),
      },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// 📌 CANCEL
exports.cancelTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        volunteerId: new mongoose.Types.ObjectId(req.user.id)
      },
      {
        status: "available",
        volunteerId: null,
      },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
