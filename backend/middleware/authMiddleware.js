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
};