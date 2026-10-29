import api from "../configs/api";

const deleteConversation = async (conversationId) => {
  try {
    const response = await api.delete(
      `/conversation/deleteConversation/${conversationId}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error While Deleting Conversation: ${error.message}`);
    throw error;
  }
};

export default deleteConversation;
