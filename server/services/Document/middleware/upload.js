import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.resolve("./uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const allowedTypes = {
  ".pdf": "application/pdf",
  ".txt": "text/plain",
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
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
