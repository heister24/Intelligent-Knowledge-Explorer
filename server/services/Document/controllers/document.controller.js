import Document from "../models/document.model.js";
import fs from "fs";
import path from "path";

export const uploadDocument = async (req, res) => {
  try {
    const userId = req?.headers["x-user-id"];
    // console.log(userId);
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

    const { originalname, mimetype, size, filename } = req.file;

    const newDocument = await Document.create({
      userId,
      originalname,
      filename,
      mimetype,
      size,
      status: "uploaded",
    });

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document: newDocument,
    });
  } catch (error) {
    console.error(`Error in uploading document: ${error.message}`);
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
    // console.log(userId)

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found in headers",
      });
    }

    const documents = await Document.find({ userId: userId });
    // console.log(documents);

    if (documents.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No documents found",
        documents: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fetched documents successfully",
      documents: documents,
    });
  } catch (error) {
    console.log(
      `Error while fetching all document of specific user : ${error.message}`,
    );
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
    // console.log(documentId);
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
    // console.log(document);

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
    console.log(`Error while fetching document by ID : ${error.message}`);
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
    // console.log(documentId);
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

    const filePath = path.resolve("./uploads", document.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res.status(200).json({
      success: true,
      message: "Document Deleted Successfully",
    });
  } catch (error) {
    console.log(`Error while deleting document : ${error.message}`);
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

    const filePath = path.resolve("./uploads", document.filename);
    // If file does NOT exist on disk, return 404
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found on server disk",
      });
    }

    return res.download(filePath, document.originalname);
  } catch (error) {
    console.log(`Error while downloading document : ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error at Downloading Document",
      error: error.message,
    });
  }
};
