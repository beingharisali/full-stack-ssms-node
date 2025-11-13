
const express = require("express");
const router = express.Router();
const {
	getAgents,
	editAgent,
	deleteAgent,
	createAgent,
	getAgent,
} = require("../controller/agent");

router.get("/agent", getAgents);
router.post("/create-agent", createAgent);
router.delete("/delete-agent/:id", deleteAgent);
router.patch("/update-agent/:id", editAgent);
router.get("/single-agent/:id", getAgent);

module.exports = router;