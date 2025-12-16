const ticketModel = require("../models/ticket");

class TicketService {
	async createTicket(ticketData) {
		return await ticketModel.create(ticketData);
	}

	async getAllTickets(filters = {}, pagination = {}) {
		const { status, priority, category, search, createdBy, assignedTo } = filters;
		const { page = 1, limit = 10, sort = "-createdAt" } = pagination;

		const query = {};
		
		if (status) query.status = status;
		if (priority) query.priority = priority;
		if (category) query.category = new RegExp(category, "i");
		if (createdBy) query.createdBy = createdBy;
		if (assignedTo) query.assignedTo = assignedTo;
		if (search) {
			query.$or = [
				{ title: new RegExp(search, "i") },
				{ description: new RegExp(search, "i") }
			];
		}

		const skip = (page - 1) * limit;
		
		const [tickets, total] = await Promise.all([
			ticketModel
				.find(query)
				.populate("createdBy", "firstName lastName email role")
				.populate("assignedTo", "firstName lastName email role")
				.sort(sort)
				.skip(skip)
				.limit(limit),
			ticketModel.countDocuments(query)
		]);

		return {
			tickets,
			meta: {
				page: parseInt(page),
				limit: parseInt(limit),
				total,
				totalPages: Math.ceil(total / limit)
			}
		};
	}

	async getTicketById(id) {
		return await ticketModel
			.findById(id)
			.populate("createdBy", "firstName lastName email role")
			.populate("assignedTo", "firstName lastName email role");
	}

	async updateTicket(id, updateData) {
		return await ticketModel
			.findByIdAndUpdate(id, updateData, { new: true })
			.populate("createdBy", "firstName lastName email role")
			.populate("assignedTo", "firstName lastName email role");
	}

	async deleteTicket(id) {
		return await ticketModel.findByIdAndDelete(id);
	}

	async assignTicket(id, assignedTo) {
		return await ticketModel
			.findByIdAndUpdate(id, { assignedTo }, { new: true })
			.populate("createdBy", "firstName lastName email role")
			.populate("assignedTo", "firstName lastName email role");
	}

	async getTicketsByUser(userId, role) {
		const query = role === "client" ? { createdBy: userId } : {};
		
		return await ticketModel
			.find(query)
			.populate("createdBy", "firstName lastName email role")
			.populate("assignedTo", "firstName lastName email role")
			.sort("-createdAt");
	}
}

module.exports = new TicketService();