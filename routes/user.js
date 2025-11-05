const express = require("express");
const router = express.Router();
const { register, login } = require("../Controllers/user");
const { authenticateJWT, authorizeRoles } = require("../middleware/auth");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route (any logged-in user)
router.get("/client", authenticateJWT, (req, res) => {
  res.json({ success: true, msg: "Profile accessed", user: req.user });
});

// Admin-only route
router.get("/admin", authenticateJWT, authorizeRoles("admin"), (req, res) => {
  res.json({ success: true, msg: "Welcome Admin", user: req.user });
});

module.exports = router;
