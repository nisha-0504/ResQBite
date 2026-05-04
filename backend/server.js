
const express = require("express");
const cors = require("cors");
require("dotenv").config();

<<<<<<< HEAD
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
=======
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

>>>>>>> origin/nishh
app.get("/", (req, res) => {
  res.send("API is running...");
});

<<<<<<< HEAD
app.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.PORT}`)
);
=======
app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});
const Donation = require("./models/Donation");

>>>>>>> origin/nishh
