import { useState, useEffect, useRef } from "react";
import fetchAllMessages from "../features/fetchAllMessages";
import sendMessage from "../features/sendMessage";

const ChatArea = ({ activeConversationId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  // 1. Fetch messages whenever active conversation changes
  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      try {
        setLoading(true);
        const data = await fetchAllMessages(activeConversationId);
        if (data?.success) {
          setMessages(data.messages || []);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [activeConversationId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 2. Send message
  const handleSend = async (e) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || !activeConversationId || sending) return;

    // Optimistically add user message to list
    const optimisticMsg = {
      _id: `temp-${Date.now()}`,
      conversationId: activeConversationId,
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setInput("");
    setSending(true);

    try {
      const data = await sendMessage(trimmed, activeConversationId);
      if (data?.success && data?.data) {
        // Replace temp msg with confirmed message from backend
        setMessages((prev) =>
          prev.map((m) => (m._id === optimisticMsg._id ? data.data : m))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!activeConversationId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 font-mono text-xs select-none">
        <div className="border border-neutral-800 bg-neutral-950 p-6 text-center max-w-sm">
          <div className="text-neutral-400 font-bold mb-2">[ NO_ACTIVE_CONVERSATION ]</div>
          <p className="text-neutral-600">
            Select a conversation from the left sidebar or click [+ NEW CHAT] to start an exploration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-black font-mono text-xs overflow-hidden">
      {/* Top Bar */}
      <div className="p-3 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/40 select-none">
        <span className="text-neutral-400 font-semibold">[ 02 // RETRIEVAL_CHAT ]</span>
        <span className="text-[10px] border border-neutral-800 text-neutral-400 px-1.5 py-0.5">
          STREAM_READY
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="text-center py-8 text-neutral-600">[ LOADING_MESSAGES... ]</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-neutral-600">
            [ READY_FOR_QUERIES ]<br />
            <span className="text-[10px] text-neutral-500">
              Ask a question about your uploaded documents to explore entity relationships.
            </span>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg._id}
                className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
              >
                <div className="text-[10px] text-neutral-500 mb-1 flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isUser ? "bg-neutral-400" : "bg-emerald-400"}`}></span>
                  <span>{isUser ? "USER" : "ASSISTANT"}</span>
                  <span className="text-neutral-700">
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                  </span>
                </div>

                <div
                  className={`p-3 max-w-[85%] whitespace-pre-wrap leading-relaxed ${
                    isUser
                      ? "bg-neutral-900 border border-neutral-700 text-neutral-200"
                      : "bg-neutral-950 border border-neutral-800 text-neutral-300"
                  }`}
                >
                  {msg.content}

                  {/* Sources citation list (if any) */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-neutral-800 text-[10px] space-y-1">
                      <div className="text-neutral-500 font-semibold">[ SOURCES_CITED ]:</div>
                      {msg.sources.map((src, i) => (
                        <div key={i} className="text-neutral-400 bg-neutral-900/60 p-1.5 border border-neutral-800">
                          <span className="text-neutral-300 font-medium">[{src.documentName || "Document"}]</span>
                          {src.snippet && <p className="text-neutral-500 mt-0.5">{src.snippet}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Form Bar */}
      <form onSubmit={handleSend} className="p-3 border-t border-neutral-800 bg-neutral-950 flex items-center gap-2">
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about your documents... [Enter to send]"
          disabled={sending}
          className="flex-1 bg-black border border-neutral-800 text-neutral-200 placeholder-neutral-600 px-3 py-2 text-xs focus:outline-none focus:border-neutral-600 resize-none font-mono"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="border border-neutral-700 hover:border-white px-4 py-2 text-neutral-300 hover:text-white uppercase transition-colors disabled:opacity-40 cursor-pointer font-bold tracking-wider"
        >
          {sending ? "[ SENDING... ]" : "[ SEND ]"}
        </button>
      </form>
    </div>
  );
};

export default ChatArea;
