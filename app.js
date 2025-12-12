require("dotenv").config();
const express = require("express");
const cors = require("cors");

const port = process.env.PORT || 5000;
const app = express();

const connecDB = require("./database/connect.js");
const userRoutes = require("./routes/user.js");

connecDB();

app.use(cors({}));
app.use(express.json());

app.use("/api/v1", userRoutes);

app.get("/", (_req, res) => {
	res.status(200).json({
		success: true,
		msg: "API working",
	});
});
app.listen(port, () => {
	console.log(`Server is up and running on port ${port}`);
});
