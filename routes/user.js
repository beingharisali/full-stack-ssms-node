const express = require("express");
const router = express.Router();
const { register, login, getProfile } = require("../controller/user");
const { authenticateJWT } = require("../middleware/auth");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateJWT, getProfile);

module.exports = router;
