import multer from "multer";
import path from "path";

// In-memory buffer storage for direct upload to Cloudinary
const storage = multer.memoryStorage();

const allowedTypes = {
  ".pdf": "application/pdf",
  ".txt": "text/plain",
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    if (allowedTypes[extension] !== file.mimetype) {
      return cb(new Error("Only PDF and TXT files are allowed"));
    }
    cb(null, true);
  },
});

export { upload, allowedTypes };
