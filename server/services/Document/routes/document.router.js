import e from "express";
import {
  deleteDocumentById,
  downloadDocumentById,
  getAllDocuments,
  getDocumentById,
  uploadDocument,
} from "../controllers/document.controller.js";
import { upload } from "../middleware/upload.js";

const router = e.Router();

router.post("/upload-document", upload.single("file"), uploadDocument);
router.get("/fetch-documents", getAllDocuments);
router.get("/getDocument/:id", getDocumentById);
router.delete("/removeDocument/:id", deleteDocumentById);
router.get("/downloadDocument/:id", downloadDocumentById);

export default router;
