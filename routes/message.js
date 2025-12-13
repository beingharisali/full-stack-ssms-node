const express = require("express");
const router = express.Router();
const {
	sendMessage,
	getMessages,
	getUnreadCount,
} = require("../controller/message");
const { authenticateJWT } = require("../middleware/auth");

router.post("/messages", authenticateJWT, sendMessage);
router.get("/tickets/:ticketId/messages", authenticateJWT, getMessages);
router.get("/messages/unread", authenticateJWT, getUnreadCount);

module.exports = router;
