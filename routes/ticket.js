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
	// Only use multer when the request is multipart/form-data (i.e. file uploads)
	(req, res, next) => {
		const ct = req.headers["content-type"] || "";
		if (ct.startsWith("multipart/form-data")) {
			return upload.array("attachments", 5)(req, res, next);
		}
		return next();
	},
	createTicket
);
router.get("/tickets", authenticateJWT, getAllTickets);
router.get("/tickets/:id", authenticateJWT, getSingleTicket);
router.patch(
	"/tickets/:id",
	authenticateJWT,
	(req, res, next) => {
		const ct = req.headers["content-type"] || "";
		if (ct.startsWith("multipart/form-data")) {
			return upload.array("attachments", 5)(req, res, next);
		}
		return next();
	},
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
	deleteTicket
);

module.exports = router;
