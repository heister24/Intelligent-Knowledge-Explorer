import { useState, useEffect, useRef } from "react";
import fetchAllDocuments from "../features/fetchAllDocuments";
import uploadDocument from "../features/uploadDocument";
import deleteDocument from "../features/deleteDocument";

const DocumentManager = ({ selectedDocIds = [], setSelectedDocIds = () => {} }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await fetchAllDocuments();
      if (data?.success) {
        setDocuments(data.documents || []);
      }
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const data = await uploadDocument(file);
      if (data?.success) {
        await loadDocuments();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this document?")) return;

    try {
      const data = await deleteDocument(id);
      if (data?.success) {
        setDocuments((prev) => prev.filter((doc) => doc._id !== id));
        setSelectedDocIds((prev) => prev.filter((docId) => docId !== id));
      }
    } catch (err) {
      console.error("Failed to delete document:", err);
    }
  };

  const toggleSelect = (id) => {
    setSelectedDocIds((prev) =>
      prev.includes(id) ? prev.filter((docId) => docId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedDocIds.length === documents.length) {
      setSelectedDocIds([]);
    } else {
      setSelectedDocIds(documents.map((d) => d._id));
    }
  };

  return (
    <div className="flex flex-col border-b border-neutral-800">
      {/* Header bar with Selection count and Upload button */}
      <div className="p-3 bg-black/40 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-neutral-400 font-semibold">[ 01 // DOCUMENTS ]</span>
          {documents.length > 0 && (
            <button
              type="button"
              onClick={toggleSelectAll}
              className="text-[10px] text-neutral-500 hover:text-neutral-300 underline cursor-pointer"
            >
              {selectedDocIds.length === documents.length ? "[ UNCHECK_ALL ]" : "[ ALL ]"}
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="border border-neutral-700 hover:border-white px-2 py-0.5 text-[10px] text-neutral-300 hover:text-white uppercase transition-colors disabled:opacity-50 cursor-pointer"
        >
          {uploading ? "[ UPLOADING... ]" : "[ + UPLOAD ]"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt"
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {/* Selected Scope Indicator */}
      <div className="px-3 py-1 bg-neutral-900/60 text-[10px] text-neutral-400 flex items-center justify-between border-b border-neutral-900">
        <span>ATTACH_TO_NEW_CHAT:</span>
        <span className={selectedDocIds.length > 0 ? "text-emerald-400 font-bold" : "text-neutral-500"}>
          {selectedDocIds.length > 0
            ? `[ ${selectedDocIds.length} SELECTED ]`
            : "[ ALL DOCS (GLOBAL) ]"}
        </span>
      </div>

      {/* Document list scroll area */}
      <div className="h-44 overflow-y-auto p-2 space-y-1">
        {loading ? (
          <div className="text-center py-4 text-neutral-600">[ LOADING_DOCUMENTS... ]</div>
        ) : documents.length === 0 ? (
          <div className="text-center py-6 text-neutral-600">[ NO_DOCUMENTS_UPLOADED ]</div>
        ) : (
          documents.map((doc) => {
            const isSelected = selectedDocIds.includes(doc._id);
            return (
              <div
                key={doc._id}
                onClick={() => toggleSelect(doc._id)}
                className={`flex items-center justify-between p-1.5 border cursor-pointer transition-colors group ${
                  isSelected
                    ? "border-emerald-600/70 bg-emerald-950/20 text-neutral-200"
                    : "border-neutral-900 hover:border-neutral-800 bg-neutral-900/30 text-neutral-400"
                }`}
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}} // handled by row onClick
                    className="accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-neutral-500">
                    {doc.originalname?.endsWith(".pdf") ? "PDF" : "TXT"}
                  </span>
                  <span className="truncate text-xs" title={doc.originalname}>
                    {doc.originalname}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleDelete(doc._id, e)}
                  className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-400 text-[10px] px-1 cursor-pointer transition-opacity"
                  title="Delete document"
                >
                  ✕
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DocumentManager;
