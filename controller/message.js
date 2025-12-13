const TicketMessage = require("../models/ticketMessage");
const ticketModel = require("../models/ticket");
const { getIO } = require("../services/socket");

const sendMessage = async (req, res) => {
	try {
		const { ticketId, content } = req.body;
		const senderId = req.user.id;

		if (!ticketId || !content) {
			return res.status(400).json({
				success: false,
				msg: "Ticket ID and content are required",
			});
		}

		const ticket = await ticketModel.findById(ticketId);
		if (!ticket) {
			return res.status(404).json({
				success: false,
				msg: "Ticket not found",
			});
		}

		const canAccess =
			ticket.createdBy.toString() === senderId ||
			ticket.assignedTo?.toString() === senderId ||
			req.user.role === "admin";

		if (!canAccess) {
			return res.status(403).json({
				success: false,
				msg: "You don't have access to this ticket",
			});
		}

		const message = await TicketMessage.create({
			ticketId,
			senderId,
			content: content.trim(),
		});

		const populatedMessage = await TicketMessage.findById(message._id)
			.populate("senderId", "firstName lastName email role")
			.lean();

		const io = getIO();
		io.to(`ticket:${ticketId}`).emit("message:new", {
			message: populatedMessage,
		});

		io.emit("notification:new", { ticketId });

		res.status(201).json({
			success: true,
			message: populatedMessage,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			msg: "Failed to send message",
			error: error.message,
		});
	}
};

const getMessages = async (req, res) => {
	try {
		const { ticketId } = req.params;
		const userId = req.user.id;

		const ticket = await ticketModel.findById(ticketId);
		if (!ticket) {
			return res.status(404).json({
				success: false,
				msg: "Ticket not found",
			});
		}

		const canAccess =
			ticket.createdBy.toString() === userId ||
			ticket.assignedTo?.toString() === userId ||
			req.user.role === "admin";

		if (!canAccess) {
			return res.status(403).json({
				success: false,
				msg: "You don't have access to this ticket",
			});
		}

		const messages = await TicketMessage.find({ ticketId })
			.populate("senderId", "firstName lastName email role")
			.sort({ createdAt: 1 })
			.lean();

		await TicketMessage.updateMany(
			{
				ticketId,
				"readBy.userId": { $ne: userId },
			},
			{
				$push: {
					readBy: { userId, readAt: new Date() },
				},
			}
		);

		res.status(200).json({
			success: true,
			messages,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			msg: "Failed to fetch messages",
			error: error.message,
		});
	}
};

const getUnreadCount = async (req, res) => {
	try {
		const userId = req.user.id;
		const mongoose = require("mongoose");
		const tickets = await ticketModel.find({
			$or: [
				{ createdBy: userId },
				{ assignedTo: userId },
				...(req.user.role === "admin" ? [{}] : []),
			],
		});

		const ticketIds = tickets.map((t) => t._id);

		const unreadCounts = await TicketMessage.aggregate([
			{ $match: { ticketId: { $in: ticketIds } } },
			{
				$group: {
					_id: "$ticketId",
					unread: {
						$sum: {
							$cond: [
								{
									$not: {
										$in: [
											new mongoose.Types.ObjectId(userId),
											"$readBy.userId",
										],
									},
								},
								1,
								0,
							],
						},
					},
				},
			},
		]);

		const result = {};
		unreadCounts.forEach((item) => {
			result[item._id.toString()] = item.unread;
		});

		res.status(200).json({
			success: true,
			unreadCounts: result,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			msg: "Failed to get unread counts",
			error: error.message,
		});
	}
};

module.exports = { sendMessage, getMessages, getUnreadCount };
