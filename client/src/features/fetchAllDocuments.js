import api from "../configs/api";

const fetchAllDocuments = async () => {
  try {
    const response = await api.get("/document/fetch-documents");
    return response.data;
  } catch (error) {
    console.error("Error while fetching all documents:", error.message);
    throw error;
  }
};

export default fetchAllDocuments;
