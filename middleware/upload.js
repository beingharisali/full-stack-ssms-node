const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, uploadsDir);
	},
	filename: (_req, file, cb) => {
		const timestamp = Date.now();
		const sanitized = file.originalname.replace(/\s+/g, "-");
		cb(null, `${timestamp}-${sanitized}`);
	},
});

const upload = multer({
	storage,
	limits: { fileSize: 10 * 1024 * 1024 },
	fileFilter: (_req, file, cb) => {
		if (!file.mimetype) {
			return cb(new Error("Invalid file type"));
		}
		cb(null, true);
	},
});

module.exports = {
	upload,
	uploadsDir,
};
