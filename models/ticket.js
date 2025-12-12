const mongoose = require("mongoose");
const ticketSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		maxLength,
	},
});
