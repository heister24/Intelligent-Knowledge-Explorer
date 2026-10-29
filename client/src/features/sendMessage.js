import api from "../configs/api";

const sendMessage = async (prompt, conversationId) => {
  try {
    const response = await api.post("/conversation/sendMessage", {
      prompt,
      conversationId,
    });
    return response.data;
  } catch (error) {
    console.error(`Error While Sending Message: ${error.message}`);
    throw error;
  }
};

export default sendMessage;
