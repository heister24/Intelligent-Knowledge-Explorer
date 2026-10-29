import { useState } from "react";
import DocumentManager from "./DocumentManager";
import ConversationList from "./ConversationList";

const Sidebar = ({ activeConversationId, setActiveConversationId }) => {
  const [selectedDocIds, setSelectedDocIds] = useState([]);

  return (
    <aside className="w-full h-full flex flex-col bg-neutral-950 text-neutral-300 font-mono text-xs select-none">
      {/* Block 1: Documents with selection */}
      <DocumentManager
        selectedDocIds={selectedDocIds}
        setSelectedDocIds={setSelectedDocIds}
      />

      {/* Block 2: Conversation list passing selectedDocIds */}
      <ConversationList
        activeConversationId={activeConversationId}
        setActiveConversationId={setActiveConversationId}
        selectedDocIds={selectedDocIds}
      />
    </aside>
  );
};

export default Sidebar;
