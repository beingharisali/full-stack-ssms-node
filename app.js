require('dotenv').config()
const port = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;
const express = require('express')
const app = express()
const cors = require("cors");
const connecDB = require("./database/connect")
const userRoutes = require("./routes/user");


const mongo_uri = "mongodb://localhost:27017/ssms-application"
connecDB();
app.use(cors()); 
app.use(express.json());
app.use("/api/v1", userRoutes);

app.get("/", (req, res) => {
	res.status(200).json({
		success: true,
		msg: "API working",
	});
});
app.listen(port, () => {
	console.log(`Server is up and running on port ${port}`);
});