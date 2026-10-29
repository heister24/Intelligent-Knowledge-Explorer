import api from "../configs/api";

const fetchAllConversations = async () => {
  try {
    const response = await api.get("/conversation/fetchConversations");
    return response.data;
  } catch (error) {
    console.error(`Error While Fetching All Conversations: ${error.message}`);
    throw error;
  }
};

export default fetchAllConversations;
