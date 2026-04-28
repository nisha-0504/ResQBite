const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const ctrl = require("../controllers/volunteerController");

router.get("/current", auth, role("volunteer"), ctrl.getCurrentTask);
router.get("/history", auth, role("volunteer"), ctrl.getHistory);

router.put("/pickup/:id", auth, role("volunteer"), ctrl.pickupTask);
router.put("/complete/:id", auth, role("volunteer"), ctrl.completeTask);
router.put("/cancel/:id", auth, role("volunteer"), ctrl.cancelTask);

module.exports = router;