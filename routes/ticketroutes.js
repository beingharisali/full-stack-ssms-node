
const express = require("express");
const router = express.Router();
const {
	getticket,
	editticket,
	deleteticket,
	createticket,
	gettickets,
} = require("../controller/ticket");

router.get("/tickets", gettickets);
router.post("/create-ticket", createticket);
router.delete("/delete-ticket/:id", deleteticket);
router.patch("/update-ticket/:id", editticket);
router.get("/single-ticket/:id", getticket);

module.exports = router;