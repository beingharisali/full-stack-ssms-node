const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema(
	{
		originalName: { type: String, required: true },
		filename: { type: String, required: true },
		url: { type: String, required: true },
		size: { type: Number, required: true },
		mimeType: { type: String, required: true },
	},
	{ _id: false }
);

const ticketSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Title is required"],
			trim: true,
		},
		description: {
			type: String,
			required: [true, "Description is required"],
			minlength: 10,
		},
		priority: {
			type: String,
			enum: ["low", "medium", "high"],
			default: "low",
			required: true,
		},
		category: {
			type: String,
			required: [true, "Category is required"],
			trim: true,
		},
		attachments: {
			type: [attachmentSchema],
			default: [],
		},
		status: {
			type: String,
			enum: ["open", "in-progress", "resolved"],
			default: "open",
			required: true,
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
			required: true,
		},
		assignedTo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
			default: null,
		},
	},
	{ timestamps: true }
);

const ticketModel = mongoose.model("ticket", ticketSchema);
module.exports = ticketModel;
