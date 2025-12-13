const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: "ticket_attachments",
		allowed_formats: ["jpeg", "jpg", "png", "gif", "webp"],
		transformation: [{ width: 500, height: 500, crop: "limit" }],
	},
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype.startsWith("image/")) {
		cb(null, true);
	} else {
		cb(
			new Error(
				"Invalid file type. Only images (JPG, PNG, GIF, WEBP) are allowed."
			),
			false
		);
	}
};

const upload = multer({
	storage: storage,
	limits: { fileSize: 10 * 1024 * 1024 },
	fileFilter: fileFilter,
});

module.exports = { upload };
