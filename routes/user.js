const express = require("express");
const router = express.Router();
const {
	register,
	login,
	getProfile,
	getAllUser,
} = require("../controller/user");
const { authenticateJWT } = require("../middleware/auth");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateJWT, getProfile);
router.get("/getUsers", getAllUser);

module.exports = router;
