import api from "../configs/api";

const uploadDocument = async (file) => {
  try {
    const formdata = new FormData();
    formdata.append("file", file);
    const response = await api.post("/document/upload-document", formdata, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error While Uploading Document:", error.message);
    throw error;
  }
};

export default uploadDocument;
