require("dotenv").config();
const mongoose = require("mongoose");
const Ticket = require("../models/ticket");
const User = require("../models/users");

async function main() {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("DB connected");

		const agent = await User.findOne({ email: "agent-ui-2@example.com" });
		const client = await User.findOne({ email: "client-ui-2@example.com" });

		if (!agent) {
			console.error("Agent not found: agent-ui-2@example.com");
			process.exit(1);
		}
		if (!client) {
			console.error("Client not found: client-ui-2@example.com");
			process.exit(1);
		}

		const ticket = await Ticket.create({
			title: "Seed assigned ticket",
			description: "This ticket was created by seed script",
			price: 0,
			priority: "low",
			category: "General",
			status: "open",
			createdBy: client._id,
			assignedTo: agent._id,
		});

		console.log("Created ticket:", ticket._id.toString());
		process.exit(0);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
}

main();
