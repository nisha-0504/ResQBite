const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
// (you'll add this later)
// const volunteerRoutes = require("./routes/volunteerRoutes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
// app.use("/api/volunteer", volunteerRoutes); // later

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ CONNECT DATABASE (IMPORTANT)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// server start
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
const volunteerRoutes = require("./routes/volunteerRoutes");
app.use("/api/volunteer", volunteerRoutes);