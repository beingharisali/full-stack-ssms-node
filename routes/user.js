const express = require("express");
const router = express.Router();
const {
	register,
	login,
	getProfile,
	getAllUser,
	getUserById,
	deleteUser,
	updateUser,
} = require("../controller/user");
const { authenticateJWT } = require("../middleware/auth");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateJWT, getProfile);
router.get("/getUsers", getAllUser);
router.get("/users/:id", authenticateJWT, getUserById);
router.delete("/users/:id", authenticateJWT, deleteUser);
router.put("/users/:id", authenticateJWT, updateUser);

module.exports = router;
