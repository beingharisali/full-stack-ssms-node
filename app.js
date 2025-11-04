require('dotenv').config()
const port = process.env.PORT;
const express = require('express')
const app = express()
const connecDB = require("./database/connect")
const mongo_uri = "mongodb://localhost:27017/ssms-application"
connecDB();
app.use(express.json());

app.get("/", (req, res) => {
	res.status(200).json({
		success: true,
		msg: "API working",
	});
});
app.listen(port, () => {
	console.log(`Server is up and running on port ${port}`);
});