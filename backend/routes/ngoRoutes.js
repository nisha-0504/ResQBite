const express = require("express");
const router = express.Router();

const {
  getDonations,
  acceptDonation,
} = require("../controllers/ngoController");

router.get("/donations", getDonations);
router.put("/accept/:id", acceptDonation);

module.exports = router;