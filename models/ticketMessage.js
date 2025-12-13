const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
	{
		ticketId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "ticket",
			required: true,
		},
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
			required: true,
		},
		content: {
			type: String,
			required: true,
			trim: true,
		},
		readBy: [
			{
				userId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "user",
				},
				readAt: { type: Date, default: Date.now },
			},
		],
	},
	{ timestamps: true }
);

messageSchema.index({ ticketId: 1, createdAt: -1 });

const TicketMessage = mongoose.model("TicketMessage", messageSchema);
module.exports = TicketMessage;
