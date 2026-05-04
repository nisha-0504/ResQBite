<<<<<<< HEAD
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, "secret");

    req.user = decoded; // 🔥 MUST contain id

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
=======
//authMiddleware.js
//authMiddleware.js
module.exports = (req, res, next) => {
  const userId = req.headers["user-id"]; // ➕ read from frontend

  if (!userId) {
    return res.status(401).json({ msg: "User not provided" });
  }

  req.user = {
    id: userId,
    role: "volunteer"
  };

  next();
>>>>>>> origin/pnithya
};