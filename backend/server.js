const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes"); // ✅ MOVE HERE

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/volunteer", volunteerRoutes); // ✅ MOVE HERE

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// server start (ALWAYS LAST)
app.listen(5000, "0.0.0.0", () => {
  console.log("🔥 Server running on port 5000");
});