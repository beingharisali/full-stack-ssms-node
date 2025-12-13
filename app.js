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
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

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
