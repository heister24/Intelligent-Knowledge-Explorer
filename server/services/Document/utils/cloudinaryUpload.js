import { Readable } from "stream";
import path from "path";
import cloudinary from "../configs/cloudinary.js";

/**
 * Uploads a file buffer directly to Cloudinary using streams.
 * Uses resource_type: "raw" to ensure PDF and TXT files remain bit-exact.
 *
 * @param {Buffer} buffer - File buffer from multer memory storage
 * @param {string} originalname - Original file name with extension
 * @returns {Promise<object>} - Cloudinary upload result
 */
export const uploadToCloudinary = (buffer, originalname) => {
  return new Promise((resolve, reject) => {
    const ext = path.extname(originalname).toLowerCase();
    const baseName = path
      .parse(originalname)
      .name.replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniquePublicId = `${Date.now()}-${baseName}${ext}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "intelligent_knowledge_explorer/documents",
        resource_type: "raw",
        public_id: uniquePublicId,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload stream error:", error);
          return reject(error);
        }
        resolve(result);
      },
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

/**
 * Deletes a file from Cloudinary given its public_id.
 *
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<object>} - Cloudinary deletion result
 */
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return null;
  return cloudinary.uploader.destroy(publicId, {
    resource_type: "raw",
  });
};
