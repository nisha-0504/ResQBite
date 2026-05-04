//roleMiddleware.js
<<<<<<< HEAD
// middleware/roleMiddleware.js
module.exports = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ message: "Access denied" });
    }

=======
module.exports = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).send("Access denied");
    }
>>>>>>> origin/pnithya
    next();
  };
};