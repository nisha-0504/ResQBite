const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getDonations,
  acceptDonation,
  getActiveDonations,
  getHistory,
} = require("../controllers/ngoController");

router.get("/donations", getDonations);

router.put("/accept/:id", acceptDonation);

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