require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");

const port = process.env.PORT || 5000;
const app = express();
const httpServer = http.createServer(app);

const connecDB = require("./database/connect.js");
const { initializeSocket } = require("./services/socket");
const userRoutes = require("./routes/user.js");
const ticketRoutes = require("./routes/ticket.js");
const messageRoutes = require("./routes/message.js");

connecDB();

app.use(cors({}));
// Capture raw body for debugging JSON parse issues
app.use(
	express.json({
		limit: "10mb",
		verify: (req, _res, buf, encoding) => {
			try {
				req.rawBody = buf && buf.toString(encoding || "utf8");
			} catch (e) {
				req.rawBody = undefined;
			}
		},
	})
);
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static(path.join(__dirname, "uploads")));

// Error handling middleware for JSON parsing
app.use((err, req, res, next) => {
	if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
		// Log raw body for debugging
		console.error("Invalid JSON received for", req.method, req.path);
		if (req.rawBody) console.error("Raw body:", req.rawBody);
		return res.status(400).json({
			success: false,
			msg: "Invalid JSON format in request body",
		});
	}
	next(err);
});

app.use("/api/v1", userRoutes);
app.use("/api/v1", ticketRoutes);
app.use("/api/v1", messageRoutes);

app.get("/", (_req, res) => {
	res.status(200).json({
		success: true,
		msg: "API working",
	});
});

initializeSocket(httpServer);

httpServer.listen(port, () => {
	console.log(`Server is up and running on port ${port}`);
});
