// routes/donorRoutes.js
const express = require("express");
const router = express.Router();

const donorController = require("../controllers/donorController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// All routes require donor login
router.use(authMiddleware);
router.use(roleMiddleware("donor"));

// Routes
router.post("/donations", donorController.createDonation);
router.get("/donations", donorController.getMyDonations);
router.get("/donations/:id", donorController.getDonationById);
router.put("/donations/:id", donorController.updateDonation);
router.delete("/donations/:id", donorController.deleteDonation);

module.exports = router;