const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../","uploads/"); // Specify the upload folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const originalName = file.originalname;
    const extension = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, extension);

    // Create a filename using the original name + timestamp to avoid collisions
    cb(null, `${nameWithoutExt}-${uniqueSuffix}${extension}`);
  },
});

module.exports = storage;