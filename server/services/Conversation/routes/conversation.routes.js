import express from "express";
import {
  createConversation,
  deleteConversationById,
  fetchAllConversations,
  fetchConversationById,
  fetchConversationsAllMessages,
  sendMessage,
} from "../controller/conversation.controller.js";

const router = express.Router();

router.post("/createConversation", createConversation);
router.get("/fetchConversations", fetchAllConversations);
router.get("/fetchConversationById/:id", fetchConversationById);
router.delete("/deleteConversation/:id", deleteConversationById);
router.get("/fetchAllMessages/:id", fetchConversationsAllMessages);
router.post("/sendMessage", sendMessage);

export default router;
