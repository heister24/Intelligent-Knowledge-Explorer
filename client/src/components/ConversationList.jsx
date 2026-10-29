import { useState, useEffect } from "react";
import fetchAllConversations from "../features/fetchAllConversations";
import createConversation from "../features/createConversation";
import deleteConversation from "../features/deleteConversation";

const ConversationList = ({
  activeConversationId,
  setActiveConversationId,
  selectedDocIds = [],
}) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  // 1. Fetch conversations from feature helper
  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await fetchAllConversations();
      if (data?.success) {
        const list = data.AllConversations || data.conversations || [];
        setConversations(list);

        // Auto-select first conversation if none is active
        if (!activeConversationId && list.length > 0) {
          setActiveConversationId(list[0]._id);
        }
      }
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // 2. Create a new conversation with selected document IDs
  const handleCreate = async () => {
    try {
      setCreating(true);
      const title = `Exploration #${conversations.length + 1}`;
      
      // Pass selectedDocIds
      const data = await createConversation(title, selectedDocIds);

      if (data?.success) {
        const newConv = data.conversation;
        setConversations((prev) => [newConv, ...prev]);
        setActiveConversationId(newConv._id);
      }
    } catch (err) {
      console.error("Failed to create conversation:", err);
    } finally {
      setCreating(false);
    }
  };

  // 3. Delete a conversation by ID
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this conversation and its messages?")) return;

    try {
      const data = await deleteConversation(id);
      if (data?.success) {
        const remaining = conversations.filter((c) => c._id !== id);
        setConversations(remaining);

        if (activeConversationId === id) {
          setActiveConversationId(remaining[0]?._id || null);
        }
      }
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header with + New Chat button */}
      <div className="p-3 bg-black/40 border-b border-neutral-800 flex items-center justify-between">
        <span className="text-neutral-400 font-semibold">[ 02 // CHATS ]</span>
        <button
          type="button"
          onClick={handleCreate}
          disabled={creating}
          className="border border-neutral-700 hover:border-white px-2 py-0.5 text-[10px] text-neutral-300 hover:text-white uppercase transition-colors disabled:opacity-50 cursor-pointer"
        >
          {creating ? "[ CREATING... ]" : "[ + NEW CHAT ]"}
        </button>
      </div>

      {/* Conversations scroll area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {loading ? (
          <div className="text-center py-4 text-neutral-600">[ LOADING_CHATS... ]</div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-8 text-neutral-600">
            [ NO_CONVERSATIONS ]<br />
            <span className="text-[10px]">Click [+ NEW CHAT] to start</span>
          </div>
        ) : (
          conversations.map((conv) => {
            const isActive = activeConversationId === conv._id;
            const docCount = conv.documentIds?.length || 0;
            return (
              <div
                key={conv._id}
                onClick={() => setActiveConversationId(conv._id)}
                className={`flex items-center justify-between p-2 border cursor-pointer transition-colors group ${
                  isActive
                    ? "border-neutral-500 bg-neutral-900 text-white"
                    : "border-neutral-900 hover:border-neutral-800 bg-neutral-950/40 text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? "bg-white" : "bg-neutral-600"
                    }`}
                  ></span>
                  <span className="truncate">{conv.title || "Untitled Exploration"}</span>
                  <span className="text-[9px] border border-neutral-800 px-1 py-0.2 text-neutral-500">
                    {docCount > 0 ? `${docCount} doc${docCount > 1 ? "s" : ""}` : "all docs"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleDelete(conv._id, e)}
                  className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-400 text-[10px] px-1 cursor-pointer transition-opacity"
                  title="Delete conversation"
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

export default ConversationList;
