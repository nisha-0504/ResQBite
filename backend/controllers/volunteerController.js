// 🔥 3 DUMMY TASKS
let tasks = [
  {
    _id: "1",
    restaurant: "Pizza Hut",
    ngo: "Helping Hands NGO",
    distance: 5,
    quantity: 10,
    status: "available",
    volunteerId: null,
    earnings: 50,
    completedAt: null,
    paid: false,
  },
  {
    _id: "2",
    restaurant: "KFC",
    ngo: "Food Care NGO",
    distance: 3,
    quantity: 8,
    status: "available",
    volunteerId: null,
    earnings: 40,
    completedAt: null,
    paid: false,
  },
  {
    _id: "3",
    restaurant: "Dominos",
    ngo: "Hunger Relief NGO",
    distance: 7,
    quantity: 12,
    status: "available",
    volunteerId: null,
    earnings: 60,
    completedAt: null,
    paid: false,
  },
];

// 🧠 MOCK USER
const getUser = () => ({
  id: "507f1f77bcf86cd799439011",
});

// 📌 CURRENT TASK (ONLY ACTIVE)
exports.getCurrentTask = (req, res) => {
  const user = getUser();

  const task = tasks.find(
    (t) =>
      t.volunteerId === user.id &&
      (t.status === "accepted" || t.status === "picked")
  );

  res.json(task || null);
};

// 📌 AVAILABLE TASKS (MULTIPLE)
exports.getAvailableTask = (req, res) => {
  const available = tasks.filter((t) => t.status === "available");
  res.json(available);
};

// 📌 HISTORY
exports.getHistory = (req, res) => {
  const user = getUser();

  const history = tasks.filter(
    (t) =>
      t.volunteerId === user.id &&
      t.status === "completed"
  );

  res.json(history);
};

// 📌 ACCEPT + PICKUP
exports.pickupTask = (req, res) => {
  const user = getUser();
  const { id } = req.params;

  const task = tasks.find((t) => t._id === id);

  if (!task) return res.status(404).json({ msg: "Task not found" });

  if (task.status === "available") {
    task.status = "accepted";
    task.volunteerId = user.id;
  } else if (task.status === "accepted") {
    task.status = "picked";
  }

  res.json(task);
};

// 📌 COMPLETE
exports.completeTask = (req, res) => {
  const user = getUser();
  const { id } = req.params;

  const task = tasks.find((t) => t._id === id);

  if (!task) return res.status(404).json({ msg: "Task not found" });

  if (task.status !== "picked") {
    return res.status(400).json({ msg: "Task not picked yet" });
  }

  task.status = "completed";
  task.completedAt = new Date().toISOString();
  // 🔥 IMPORTANT
  task.earnings = task.earnings || 50;
  task.paid = false; // ADD THIS
  task.volunteerId = user.id;

  res.json(task);
};

// 📌 CANCEL
exports.cancelTask = (req, res) => {
  const { id } = req.params;

  const task = tasks.find((t) => t._id === id);

  if (!task) return res.status(404).json({ msg: "Task not found" });

  task.status = "available";
  task.volunteerId = null;

  res.json({ msg: "Cancelled" });
};