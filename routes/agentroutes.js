
const express = require("express");
const router = express.Router();
const {
	getAgents,
	editAgent,
	deleteAgent,
	createAgent,
	getAgent,
} = require("../controller/agent");

router.get("/tickets", getAgents);
router.post("/create-ticket", createAgent);
router.delete("/delete-ticket/:id", deleteAgent);
router.patch("/update-ticket/:id", editAgent);
router.get("/single-ticket/:id", getAgent);

module.exports = router;