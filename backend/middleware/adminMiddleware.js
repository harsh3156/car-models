// ── @desc    Restrict access to admin role only
// ── Usage    router.delete("/route", protect, adminOnly, handler)
// ── Note     Must be used AFTER the protect middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ success: false, message: "Access denied — admins only" });
};

module.exports = { adminOnly };
