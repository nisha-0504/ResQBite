<<<<<<< HEAD
//donorRoutes.js
=======
>>>>>>> origin/nishh
// routes/donorRoutes.js
const express = require("express");
const router = express.Router();

const donorController = require("../controllers/donorController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

<<<<<<< HEAD
// ✅ Apply middlewares properly
router.use(authMiddleware);

// 🔥 FIX: ensure roleMiddleware returns function
=======
// All routes require donor login
router.use(authMiddleware);
>>>>>>> origin/nishh
router.use(roleMiddleware("donor"));

// Routes
router.post("/donations", donorController.createDonation);
router.get("/donations", donorController.getMyDonations);
router.get("/donations/:id", donorController.getDonationById);
router.put("/donations/:id", donorController.updateDonation);
router.delete("/donations/:id", donorController.deleteDonation);

<<<<<<< HEAD
module.exports = router;
=======
module.exports = router;
>>>>>>> origin/nishh
