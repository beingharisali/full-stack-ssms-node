const {
	createTicket,
	getAllTickets,
	getSingleTicket,
	updateTicket,
	deleteTicket,
	assignTicket,
} = require("../controller/ticket");
const express = require("express");
const { upload } = require("../middleware/upload");
const { authenticateJWT, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.post(
	"/tickets",
	authenticateJWT,
	upload.array("attachments", 5),
	createTicket
);
router.get("/tickets", authenticateJWT, getAllTickets);
router.get("/tickets/:id", authenticateJWT, getSingleTicket);
router.patch(
	"/tickets/:id",
	authenticateJWT,
	upload.array("attachments", 5),
	updateTicket
);
router.patch(
	"/tickets/:id/assign",
	authenticateJWT,
	authorizeRoles("admin"),
	assignTicket
);
router.delete(
	"/tickets/:id",
	authenticateJWT,
	authorizeRoles("admin"),
	deleteTicket
);

module.exports = router;
