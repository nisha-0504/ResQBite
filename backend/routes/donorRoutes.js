//donorRoutes.js
// routes/donorRoutes.js
const express = require("express");
const router = express.Router();

const donorController = require("../controllers/donorController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ✅ Apply middlewares properly
router.use(authMiddleware);

// 🔥 FIX: ensure roleMiddleware returns function
router.use(roleMiddleware("donor"));

// Routes
router.post("/donations", donorController.createDonation);
router.get("/donations", donorController.getMyDonations);
router.get("/donations/:id", donorController.getDonationById);
router.put("/donations/:id", donorController.updateDonation);
router.delete("/donations/:id", donorController.deleteDonation);

module.exports = router;