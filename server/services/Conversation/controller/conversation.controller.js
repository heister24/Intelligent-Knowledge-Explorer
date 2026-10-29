import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const createConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found in headers",
      });
    }

    const { title, documentIds } = req.body;

    const newConversation = await Conversation.create({
      userId: userId,
      title: title?.trim() || "New Exploration",
      documentIds: Array.isArray(documentIds) ? documentIds : [],
    });

    return res.status(201).json({
      success: true,
      message: "Conversation created successfully",
      conversation: newConversation,
    });
  } catch (error) {
    console.error(`Error in createConversation: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error while creating conversation",
      error: error.message,
    });
  }
};

export const fetchAllConversations = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found in headers",
      });
    }

    const conversations = await Conversation.find({ userId: userId }).sort({
      lastMessageAt: -1,
      updatedAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "Conversations fetched successfully",
      AllConversations: conversations, // Provided for backwards compatibility
    });
  } catch (error) {
    console.error(`Error while fetching all conversations: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching all conversations",
      error: error.message,
    });
  }
};

export const fetchConversationById = async (req, res) => {
  try {
    const conversationId = req.params.id;
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found in headers",
      });
    }

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId: userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Conversation fetched successfully",
      conversation: conversation,
    });
  } catch (error) {
    console.error(`Error while fetching conversation by id: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching conversation by id",
      error: error.message,
    });
  }
};

export const deleteConversationById = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const conversationId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found in headers",
      });
    }

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      });
    }

    const deletedConversation = await Conversation.findOneAndDelete({
      userId: userId,
      _id: conversationId,
    });

    if (!deletedConversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found or unauthorized",
      });
    }

    // Cascade delete all associated messages
    await Message.deleteMany({ conversationId: conversationId });

    return res.status(200).json({
      success: true,
      message: "Conversation and messages deleted successfully",
    });
  } catch (error) {
    console.error(`Error while deleting conversation: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting conversation",
      error: error.message,
    });
  }
};

export const fetchConversationsAllMessages = async (req, res) => {
  try {
    const conversationId = req.params.id;
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found in headers",
      });
    }

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      });
    }

    // Verify conversation exists and belongs to the user
    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId: userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found or unauthorized",
      });
    }

    const messages = await Message.find({
      conversationId: conversationId,
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      messages: messages,
    });
  } catch (error) {
    console.error(
      `Error while fetching messages of conversation: ${error.message}`,
    );
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching messages of conversation",
      error: error.message,
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const { prompt, conversationId } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found in headers",
      });
    }

    if (!prompt || !prompt.trim() || !conversationId) {
      return res.status(400).json({
        success: false,
        message: "prompt and conversationId are required",
      });
    }

    // Verify conversation belongs to user
    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId: userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found or unauthorized",
      });
    }

    const msg = await Message.create({
      conversationId,
      role: "user",
      content: prompt.trim(),
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessageAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      msg: msg,
      data: msg,
    });
  } catch (error) {
    console.error(`Error while sending message: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error while sending message",
      error: error.message,
    });
  }
};
