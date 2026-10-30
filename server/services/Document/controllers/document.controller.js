import Document from "../models/document.model.js";
import fs from "fs";
import path from "path";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinaryUpload.js";

export const uploadDocument = async (req, res) => {
  try {
    const userId = req?.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found in headers",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please upload a valid PDF or TXT file.",
      });
    }

    // Verify Cloudinary environment variables
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return res.status(500).json({
        success: false,
        message:
          "Cloudinary credentials missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in server/services/Document/.env",
      });
    }

    const { originalname, mimetype, size, buffer } = req.file;

    // Stream buffer directly to Cloudinary
    const cloudResult = await uploadToCloudinary(buffer, originalname);

    const newDocument = await Document.create({
      userId,
      originalname,
      filename: cloudResult.public_id,
      mimetype,
      size,
      fileUrl: cloudResult.secure_url,
      cloudinaryPublicId: cloudResult.public_id,
      status: "uploaded",
    });

    return res.status(201).json({
      success: true,
      message: "Document uploaded to Cloudinary successfully",
      document: newDocument,
    });
  } catch (error) {
    console.error(`Error in uploading document to cloud: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error at Upload Document",
      error: error.message,
    });
  }
};

export const getAllDocuments = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found in headers",
      });
    }

    const documents = await Document.find({ userId: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Fetched documents successfully",
      documents: documents,
    });
  } catch (error) {
    console.error(`Error while fetching documents: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error at Fetching Document",
      error: error.message,
    });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const documentId = req.params.id;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: "DocumentId not found",
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: userId,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Document fetched successfully",
      document: document,
    });
  } catch (error) {
    console.error(`Error while fetching document by ID: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error at Fetching Document by ID",
      error: error.message,
    });
  }
};

export const deleteDocumentById = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const documentId = req.params.id;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: "DocumentId not found",
      });
    }

    const document = await Document.findOneAndDelete({
      _id: documentId,
      userId: userId,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found or unauthorized",
      });
    }

    // 1. Delete from Cloudinary if stored in cloud
    if (document.cloudinaryPublicId) {
      try {
        await deleteFromCloudinary(document.cloudinaryPublicId);
      } catch (cloudErr) {
        console.error(`Failed to delete from Cloudinary: ${cloudErr.message}`);
      }
    }

    // 2. Fallback: Clean up legacy local file on disk if it exists
    if (document.filename) {
      const filePath = path.resolve("./uploads", document.filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (fsErr) {
          console.error(`Failed to unlink local file: ${fsErr.message}`);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Document Deleted Successfully",
    });
  } catch (error) {
    console.error(`Error while deleting document: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error at Deleting Document",
      error: error.message,
    });
  }
};

export const downloadDocumentById = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const documentId = req.params.id;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: "DocumentId not found",
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: userId,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // 1. If stored in Cloudinary, stream file bytes to client
    if (document.fileUrl) {
      const cloudRes = await fetch(document.fileUrl);
      if (!cloudRes.ok) {
        return res.status(cloudRes.status).json({
          success: false,
          message: "Failed to retrieve document from Cloudinary",
        });
      }

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(document.originalname)}"`,
      );
      res.setHeader("Content-Type", document.mimetype || "application/octet-stream");

      const arrayBuffer = await cloudRes.arrayBuffer();
      return res.send(Buffer.from(arrayBuffer));
    }

    // 2. Fallback: If legacy local file on disk
    if (document.filename) {
      const filePath = path.resolve("./uploads", document.filename);
      if (fs.existsSync(filePath)) {
        return res.download(filePath, document.originalname);
      }
    }

    return res.status(404).json({
      success: false,
      message: "Document file not found in cloud storage or on server disk",
    });
  } catch (error) {
    console.error(`Error while downloading document: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error at Downloading Document",
      error: error.message,
    });
  }
};
