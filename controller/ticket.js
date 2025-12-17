const model = require("../models/ticket");
const { getIO } = require("../services/socket");

const createTicket = async (req, res) => {
	try {
		const { title, description, priority, category, status, assignedTo } = req.body;
		const createdBy = req.user?.id || req.user?._id;

		if (!createdBy) {
			return res.status(401).json({
				success: false,
				msg: "Unauthorized",
			});
		}

		if (!title || !description || !category) {
			return res.status(400).json({
				success: false,
				msg: "Title, description, and category are required",
			});
		}

		const uploadedFiles = req.files || [];
		const attachmentsToSave = uploadedFiles.map((file) => ({
			originalName: file.originalname,
			filename: file.filename,
			url: file.path || `/uploads/${file.filename}`,
			size: file.size,
			mimeType: file.mimetype,
		}));

		const ticket = await model.create({
			title,
			description,
			priority: priority || "low",
			category,
			status: status || "open",
			attachments: attachmentsToSave,
			createdBy,
			assignedTo: assignedTo || null,
		});

		const populatedTicket = await model
			.findById(ticket._id)
			.populate("createdBy", "firstName lastName email")
			.populate("assignedTo", "firstName lastName email");

		const io = getIO();
		if (io) {
			io.emit("ticket:created", { ticket: populatedTicket });
		}

		res.status(201).json({
			success: true,
			ticket: populatedTicket,
			msg: "Ticket created successfully",
		});
	} catch (error) {
		return res.status(400).json({
			success: false,
			msg: "Error occurred in creating Ticket",
			error: error.message,
		});
	}
};

const getAllTickets = async (req, res) => {
	try {
		const user = req.user;
		let query = {};

		if (user.role === "client") {
			query.createdBy = user.id;
		} else if (user.role === "agent") {
			query.assignedTo = user.id;
		}

		const tickets = await model
			.find(query)
			.populate("createdBy", "firstName lastName email")
			.populate("assignedTo", "firstName lastName email")
			.sort({ createdAt: -1 });

		res.status(200).json({
			success: true,
			tickets,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			msg: "Error occurred in fetching tickets",
			error: error.message,
		});
	}
};

const getSingleTicket = async (req, res) => {
	try {
		const { id } = req.params;
		const user = req.user;

		const ticket = await model
			.findById(id)
			.populate("createdBy", "firstName lastName email")
			.populate("assignedTo", "firstName lastName email");

		if (!ticket) {
			return res.status(404).json({
				success: false,
				msg: "Ticket not found",
			});
		}

		const canAccess =
			user.role === "admin" ||
			ticket.createdBy._id.toString() === user.id ||
			(ticket.assignedTo && ticket.assignedTo._id && ticket.assignedTo._id.toString() === user.id);

		if (!canAccess) {
			return res.status(403).json({
				success: false,
				msg: "You don't have access to this ticket",
			});
		}

		res.status(200).json({
			success: true,
			ticket,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			msg: "Error occurred in fetching ticket",
			error: error.message,
		});
	}
};

const updateTicket = async (req, res) => {
	try {
		const { id } = req.params;
		const updates = req.body;
		const user = req.user;

		const ticket = await model.findById(id);
		if (!ticket) {
			return res.status(404).json({
				success: false,
				msg: "Ticket not found",
			});
		}

		const canUpdate = user.role === "admin" || 
			ticket.createdBy.toString() === user.id ||
			(user.role === "agent" && ticket.assignedTo && ticket.assignedTo.toString() === user.id);

		if (!canUpdate) {
			return res.status(403).json({
				success: false,
				msg: "You don't have permission to update this ticket",
			});
		}

		if (updates.assignedTo && user.role !== "admin") {
			return res.status(403).json({
				success: false,
				msg: "Only admins can assign tickets",
			});
		}

		const uploadedFiles = req.files || [];
		if (uploadedFiles.length > 0) {
			const newAttachments = uploadedFiles.map((file) => ({
				originalName: file.originalname,
				filename: file.filename,
				url: file.path || `/uploads/${file.filename}`,
				size: file.size,
				mimeType: file.mimetype,
			}));
			updates.attachments = [...(ticket.attachments || []), ...newAttachments];
		}

		const updatedTicket = await model
			.findByIdAndUpdate(id, updates, {
				new: true,
				runValidators: true,
			})
			.populate("createdBy", "firstName lastName email")
			.populate("assignedTo", "firstName lastName email");

		const io = getIO();
		if (io) {
			io.emit("ticket:updated", { ticket: updatedTicket });
			if (updates.assignedTo) {
				io.emit("ticket:assigned", { ticket: updatedTicket });
			}
		}

		res.status(200).json({
			success: true,
			ticket: updatedTicket,
			msg: "Ticket updated successfully",
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			msg: "Error occurred in updating ticket",
			error: error.message,
		});
	}
};

const deleteTicket = async (req, res) => {
	try {
		const { id } = req.params;
		const user = req.user;

		const ticket = await model.findById(id);
		if (!ticket) {
			return res.status(404).json({
				success: false,
				msg: "Ticket not found",
			});
		}

		if (user.role !== "admin" && ticket.createdBy.toString() !== user.id) {
			return res.status(403).json({
				success: false,
				msg: "You don't have permission to delete this ticket",
			});
		}

		await model.findByIdAndDelete(id);

		const io = getIO();
		if (io) {
			io.emit("ticket:deleted", { ticketId: id });
		}

		res.status(200).json({
			success: true,
			msg: "Ticket deleted successfully",
			ticket,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			msg: "Error occurred in deleting ticket",
			error: error.message,
		});
	}
};

const assignTicket = async (req, res) => {
	try {
		const { id } = req.params;
		const { assignedTo } = req.body;
		const user = req.user;

		if (user.role !== "admin") {
			return res.status(403).json({
				success: false,
				msg: "Only admins can assign tickets",
			});
		}

		const ticket = await model
			.findByIdAndUpdate(
				id,
				{ assignedTo: assignedTo || null },
				{ new: true, runValidators: true }
			)
			.populate("createdBy", "firstName lastName email")
			.populate("assignedTo", "firstName lastName email");

		if (!ticket) {
			return res.status(404).json({
				success: false,
				msg: "Ticket not found",
			});
		}

		const io = getIO();
		if (io) {
			io.emit("ticket:assigned", { ticket });
		}

		res.status(200).json({
			success: true,
			ticket,
			msg: "Ticket assigned successfully",
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			msg: "Error occurred in assigning ticket",
			error: error.message,
		});
	}
};

module.exports = {
	createTicket,
	getAllTickets,
	getSingleTicket,
	updateTicket,
	deleteTicket,
	assignTicket,
};
