//authMiddleware.js
module.exports = (req, res, next) => {
  req.user = {
    id: "507f1f77bcf86cd799439011", // valid format
    role: "volunteer"
  };
  next();
};