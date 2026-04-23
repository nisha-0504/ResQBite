//const donationRoutes = require("./routes/donationRoutes");
const authRoutes = require("./routes/authRoutes");
const express = require("express");
const cors = require("cors");

require("dotenv").config();
//const connectDB = require("./config/db");

//connectDB(); 

const app = express();

app.use(cors());
app.use(express.json());
//app.use("/api/donations", donationRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});