
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const ngoRoutes = require("./routes/ngoRoutes"); 

const app = express();

// connect DB
connectDB();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/ngo", ngoRoutes); 

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});
const Donation = require("./models/Donation");

