const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getDonations,
  acceptDonation,
  getActiveDonations,
  getHistory,
  getDonationById,
} = require("../controllers/ngoController");

router.get("/donations", getDonations);
router.get("/donations/:id", authMiddleware, getDonationById);

router.put(
  "/accept/:id",
  authMiddleware,
  acceptDonation
);

router.get(
  "/active",
  authMiddleware,
  getActiveDonations
);
router.get(
  "/history",
  authMiddleware,
  getHistory
);

module.exports = router;