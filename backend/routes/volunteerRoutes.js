const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware"); // ➕ ADD

const ctrl = require("../controllers/volunteerController");
router.get("/current", auth, ctrl.getCurrentTask);       // ✅ FIXED
router.get("/history", auth, ctrl.getHistory);           // ✅ FIXED
router.get("/available", auth, ctrl.getAvailableTasks);  // ✅ FIXED

router.put("/pickup/:id", auth, ctrl.pickupTask);        // ✅ FIXED
router.put("/complete/:id", auth, ctrl.completeTask);    // ✅ FIXED
router.put("/cancel/:id", auth, ctrl.cancelTask);        // ✅ FIXED

module.exports = router;