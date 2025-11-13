
const express = require("express");
const router = express.Router();
const {
	getticket,
	editticket,
	deleteticket,
	createticket,
	gettickets,
} = require("../controller/ticket");

router.get("/tickets", getticket);
router.post("/create-ticket", createticket);
router.delete("/delete-ticket/:id", deleteticket);
router.patch("/update-ticket/:id", editticket);
router.get("/single-ticket/:id", gettickets);

module.exports = router;