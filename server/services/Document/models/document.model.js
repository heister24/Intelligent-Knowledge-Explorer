import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    originalname: {
      type: String,
      required : true,
    },
    filename: {
      type: String,
      required : true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["uploaded", "processing", "processed", "failed"],
      default: "uploaded",
    },
  },
  { timestamps: true },
);

const Document = mongoose.model("Document", documentSchema);
export default Document;
