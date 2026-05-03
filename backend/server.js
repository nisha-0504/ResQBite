//const donationRoutes = require("./routes/donationRoutes");
const authRoutes = require("./routes/authRoutes");
const express = require("express");
const cors = require("cors");

require("dotenv").config();
//const connectDB = require("./config/db");

//connectDB(); 
const connectDB = require("./config/db");
const app = express();
app.use(cors());
app.use(express.json());
const donorRoutes = require("./routes/donorRoutes");

app.use("/api/donor", donorRoutes);

//app.use("/api/donations", donationRoutes);
app.use("/api/auth", authRoutes);
connectDB();
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.PORT}`)
);