const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware"); // ➕ ADD

const ctrl = require("../controllers/volunteerController");
router.get("/history", ctrl.getHistory);
router.get("/current", ctrl.getCurrentTask);
router.get("/available", ctrl.getAvailableTasks);

router.put("/pickup/:id", ctrl.pickupTask);
router.put("/complete/:id", ctrl.completeTask);
router.put("/cancel/:id", ctrl.cancelTask);        // ✅ FIXED

module.exports = router;