import mongoose from "mongoose";

const convSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      default: "New Exploration",
    },
    // Optional: pin or tag specific documents scoped to this conversation
    documentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const Conversation = mongoose.model("Conversation", convSchema);
export default Conversation;
