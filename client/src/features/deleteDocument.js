import api from "../configs/api";

const deleteDocument = async (documentId) => {
  try {
    const response = await api.delete(`/document/removeDocument/${documentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error While Removing Document: ${error.message}`);
    throw error;
  }
};

export default deleteDocument;
