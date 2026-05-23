const User = require("../models/User");

module.exports = (role) => {
  return async (req, res, next) => {
    try {
      console.log("TOKEN USER:", req.user);

      const user = await User.findById(req.user.id);

      console.log("DB USER:", user);

      if (!user || user.role !== role) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  };
};