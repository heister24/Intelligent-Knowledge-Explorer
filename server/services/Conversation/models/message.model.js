import mongoose from "mongoose";

const msgSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    sources: [
      {
        documentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Document",
        },
        documentName: {
          type: String,
        },
        snippet: String,
        graphContext: {
          entities: [String],
          traversalPath: [String],
        },
      },
    ],
  },
  { timestamps: true },
);

const Message = mongoose.model("Message", msgSchema);
export default Message;
