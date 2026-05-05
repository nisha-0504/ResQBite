const Task = require("../models/Task");// ➕ ADD

// 📌 CURRENT TASK (ONLY ACTIVE)
exports.getCurrentTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      status: { $in: ["accepted", "picked"] }
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
      status: "completed"
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
      task.volunteerId = null; // temporary (no auth mode)
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
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: "Not found" });

    // ✅ prevent duplicate updates
    if (task.status === "completed") {
      return res.json(task);
    }

    task.status = "completed";
    task.completedAt = new Date();

    await task.save();

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// 📌 CANCEL
exports.cancelTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        status: "available",
        volunteerId: null,
      },
      { new: true }
    );

    if (!task) return res.status(404).json({ msg: "Not found" });

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};