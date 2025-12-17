require("dotenv").config();
const userModel = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const ROLE_OPTIONS = ["admin", "agent", "client"];

const buildAuthPayload = (user) => ({
	id: user._id,
	firstName: user.firstName,
	lastName: user.lastName,
	email: user.email,
	role: user.role,
});

//  REGISTER
const register = async (req, res) => {
	try {
		// Validate request body exists
		if (!req.body || typeof req.body !== 'object') {
			return res.status(400).json({
				success: false,
				msg: "Invalid request body"
			});
		}

		const { firstName, lastName, email, password, role = "client" } = req.body;

		if (!firstName || !lastName || !email || !password) {
			return res
				.status(400)
				.json({ success: false, msg: "All fields are required" });
		}

		if (!ROLE_OPTIONS.includes(role)) {
			return res.status(400).json({
				success: false,
				msg: "Invalid role supplied",
			});
		}

		const isUserExist = await userModel.findOne({ email });
		if (isUserExist) {
			return res.status(400).json({
				success: false,
				msg: "Email already exists, please use another email",
			});
		}

		if (password.length < 8) {
			return res.status(400).json({
				success: false,
				msg: "Password must be at least 8 characters",
			});
		}

		const hashedPassword = await bcrypt.hash(password, 8);

		const user = await userModel.create({
			firstName: firstName.trim(),
			lastName: lastName.trim(),
			email: email.toLowerCase(),
			password: hashedPassword,
			role,
		});

		const token = jwt.sign(
			{ id: user._id, email: user.email, role: user.role },
			JWT_SECRET,
			{ expiresIn: "6h" }
		);

		res.status(201).json({
			success: true,
			msg: "User registered successfully",
			token,
			user: buildAuthPayload(user),
		});
	} catch (err) {
		res
			.status(500)
			.json({ success: false, msg: "Server error", error: err.message });
	}
};

// LOGIN
const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res
				.status(400)
				.json({ success: false, msg: "Email and password are required" });
		}
		if (password.length < 8) {
			return res.status(400).json({
				success: false,
				msg: "Password must be at least 8 characters",
			});
		}
		const user = await userModel.findOne({ email });
		if (!user) {
			return res.status(404).json({ success: false, msg: "Email not found" });
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (!isPasswordCorrect) {
			return res
				.status(401)
				.json({ success: false, msg: "Invalid credentials" });
		}

		const token = jwt.sign(
			{ id: user._id, email: user.email, role: user.role },
			JWT_SECRET,
			{ expiresIn: "6h" }
		);

		res.status(200).json({
			success: true,
			msg: "User logged in successfully",
			token,
			user: buildAuthPayload(user),
		});
	} catch (err) {
		res
			.status(500)
			.json({ success: false, msg: "Server error", error: err.message });
	}
};

const getProfile = async (req, res) => {
	try {
		const user = await userModel.findById(req.user.id);
		if (!user) {
			return res
				.status(404)
				.json({ success: false, msg: "User profile not found" });
		}
		res.status(200).json({ success: true, user: buildAuthPayload(user) });
	} catch (error) {
		res.status(500).json({
			success: false,
			msg: "Failed to load profile",
			error: error.message,
		});
	}
};
const getAllUser = async (req, res) => {
	try {
		const users = await userModel.find({}).select("-password");
		res.status(200).json({
			success: true,
			users: users.map(user => ({
				_id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				role: user.role,
			})),
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			msg: "Failed to get users",
			error: error.message,
		});
	}
};
module.exports = { register, login, getProfile, getAllUser };
