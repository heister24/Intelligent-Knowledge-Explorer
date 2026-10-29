import api from "../configs/api";

const fetchAllMessages = async (conversationId) => {
  try {
    const response = await api.get(`/conversation/fetchAllMessages/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error(`Error While Fetching All Messages: ${error.message}`);
    throw error;
  }
};

export default fetchAllMessages;
