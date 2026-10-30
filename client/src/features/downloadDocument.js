import api from "../configs/api";

const downloadDocument = async (documentId, originalname) => {
  try {
    const response = await api.get(`/document/downloadDocument/${documentId}`, {
      responseType: "blob",
    });

    const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", originalname || "downloaded-file");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Error while downloading document:", error.message);
    throw error;
  }
};

export default downloadDocument;
