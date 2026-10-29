import api from "../configs/api";

const createConversation = async (title, documentIds = []) => {
  try {
    const response = await api.post("/conversation/createConversation", {
      title,
      documentIds,
    });
    return response.data;
  } catch (error) {
    console.error(`Error While Creating New Conversation: ${error.message}`);
    throw error;
  }
};

export default createConversation;
