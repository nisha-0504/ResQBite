//const Task = require("../models/Task");// ➕ ADD
const Donation =
  require("../models/Donation");
// 📌 CURRENT TASK (ONLY ACTIVE)
exports.getCurrentTask =
  async (req, res) => {

    try {

      const donation =
        await Donation.findOne({
          volunteerId: req.user.id,
          status: {
            $in: [
              "assigned",
              "picked",
            ],
          },
        });
      console.log(donation);
      res.json(donation || null);

    } catch (err) {

      console.error(err);

      res.status(500).json({
        msg: "Server error",
      });
    }
  };

// 📌 AVAILABLE TASKS (MULTIPLE)
exports.getAvailableTasks =
  async (req, res) => {


    try {

      const donations =
        await Donation.find({
          status: "accepted",
          volunteerId: null
        }).sort({
          updatedAt: -1,
        });

      res.json(donations);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        msg: "Server error",
      });
    }
  };

// 📌 HISTORY
exports.getHistory =
  async (req, res) => {

    try {

      const donations =
        await Donation.find({
          volunteerId: req.user.id,
          status: "completed",
        }).sort({
          completedAt: -1,
        });

      res.json(donations);

    } catch (err) {

      console.error(err);

      res.status(500).json({
        msg: "Server error",
      });
    }
  };

// 📌 ACCEPT + PICKUP
exports.pickupTask =
  async (req, res) => {

    try {

      const donation =
        await Donation.findById(
          req.params.id
        );

      if (!donation) {

        return res.status(404).json({
          msg: "Not found",
        });
      }

      // Volunteer accepts task
      if (
        donation.status ===
        "accepted"
      ) {

        donation.status =
          "assigned";

        donation.volunteerId =
          req.user.id;
      }

      // Volunteer picked food
      else if (
        donation.status ===
        "assigned"
      ) {

        donation.status =
          "picked";

        donation.pickedAt =
          new Date();
      }

      if (req.body.volunteerLatitude !== undefined) {
        donation.volunteerLatitude = req.body.volunteerLatitude;
      }
      if (req.body.volunteerLongitude !== undefined) {
        donation.volunteerLongitude = req.body.volunteerLongitude;
      }

      await donation.save();

      res.json(donation);

    } catch (err) {

      console.error(err);

      res.status(500).json({
        msg: "Server error",
      });
    }
  };

// 📌 COMPLETE
exports.completeTask =
  async (req, res) => {

    try {

      const donation =
        await Donation.findOne({

          _id: req.params.id,

          volunteerId: req.user.id

        });

      if (!donation) {

        return res.status(404).json({
          msg: "Not found"
        });

      }

      donation.status = "completed";

      donation.completedAt =
        new Date();

      if (req.body.volunteerLatitude !== undefined) {
        donation.volunteerLatitude = req.body.volunteerLatitude;
      }
      if (req.body.volunteerLongitude !== undefined) {
        donation.volunteerLongitude = req.body.volunteerLongitude;
      }

      await donation.save();

      res.json(donation);

    } catch (err) {

      console.error(err);

      res.status(500).json({
        msg: "Server error"
      });

    }

  };

// 📌 CANCEL
exports.cancelTask =
  async (req, res) => {

    try {

      const donation =
        await Donation.findByIdAndUpdate(
          req.params.id,
          {
            status: "accepted",
            volunteerId: null,
          },
          { new: true }
        );

      if (!donation) {

        return res.status(404).json({
          msg: "Not found",
        });
      }

      res.json(donation);

    } catch (err) {

      console.error(err);

      res.status(500).json({
        msg: "Server error",
      });
    }
  };