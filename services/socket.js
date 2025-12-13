const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const userModel = require("../models/users");

let io = null;

const initializeSocket = (httpServer) => {
	io = new Server(httpServer, {
		cors: {
			origin: process.env.CLIENT_URL || "http://localhost:3000",
			methods: ["GET", "POST"],
			credentials: true,
		},
	});

	const onlineUsers = new Map();

	io.use(async (socket, next) => {
		const token = socket.handshake.auth?.token;
		if (!token) {
			return next(new Error("Authentication error"));
		}

		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			const user = await userModel.findById(decoded.id);
			if (!user) {
				return next(new Error("User not found"));
			}
			socket.userId = user._id.toString();
			socket.userRole = user.role;
			next();
		} catch (err) {
			next(new Error("Invalid token"));
		}
	});

	io.on("connection", (socket) => {
		onlineUsers.set(socket.userId, {
			userId: socket.userId,
			role: socket.userRole,
		});

		io.emit("online:users", Array.from(onlineUsers.values()));

		socket.on("ticket:join", (ticketId) => {
			socket.join(`ticket:${ticketId}`);
		});

		socket.on("ticket:leave", (ticketId) => {
			socket.leave(`ticket:${ticketId}`);
		});

		socket.on("disconnect", () => {
			onlineUsers.delete(socket.userId);
			io.emit("online:users", Array.from(onlineUsers.values()));
		});
	});

	return io;
};

const getIO = () => {
	if (!io) {
		throw new Error("Socket.IO not initialized");
	}
	return io;
};

module.exports = { initializeSocket, getIO };
