const express = require("express");
const router = express.Router();


const ctrl = require("../controllers/volunteerController");
router.get("/current", ctrl.getCurrentTask);
router.get("/history", ctrl.getHistory);
router.get("/available", ctrl.getAvailableTask);

router.put("/pickup/:id", ctrl.pickupTask);
router.put("/complete/:id", ctrl.completeTask);
router.put("/cancel/:id", ctrl.cancelTask);

module.exports = router;