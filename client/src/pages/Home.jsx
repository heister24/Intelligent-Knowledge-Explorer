import { useState } from "react";
import { useSelector } from "react-redux";
import Login from "../components/Login";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";

const Home = () => {
  const { userData, loading } = useSelector((state) => state.user);
  const [activeConversationId, setActiveConversationId] = useState(null);

  // 1. Initial auth check is pending
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-neutral-400 flex items-center justify-center font-mono text-xs">
        <div className="flex items-center gap-3 border border-neutral-800 bg-neutral-950 px-6 py-4">
          <span className="inline-block w-2 h-2 bg-white animate-pulse"></span>
          <span>[ VERIFYING_SESSION_STREAM... ]</span>
        </div>
      </div>
    );
  }

  // 2. User is NOT logged in: Show the retro Login screen
  if (!userData) {
    return <Login />;
  }

  // 3. User IS logged in: Render 3-section Retro Dashboard
  return (
    <div className="min-h-screen bg-black text-neutral-200 flex flex-col font-mono">
      {/* Top Header with Logout */}
      <Header />

      {/* Main 3-Section Dashboard Body */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden h-[calc(100vh-3.5rem)]">
        {/* SECTION 1: Left Panel (Documents & History) - 3 cols */}
        <section className="md:col-span-3 border-r border-neutral-800 bg-neutral-950/50 flex flex-col overflow-hidden">
          <Sidebar
            activeConversationId={activeConversationId}
            setActiveConversationId={setActiveConversationId}
          />
        </section>

        {/* SECTION 2: Center Panel (Chat & Q&A) - 5 cols */}
        <section className="md:col-span-5 border-r border-neutral-800 bg-black flex flex-col overflow-hidden">
          <ChatArea activeConversationId={activeConversationId} />
        </section>

        {/* SECTION 3: Right Panel (Knowledge Graph Visualization) - 4 cols */}
        <section className="md:col-span-4 bg-neutral-950/50 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
            <span>[ 03 // ENTITY_RELATION_GRAPH ]</span>
            <span className="text-[10px] border border-neutral-800 px-1.5 py-0.5">
              GRAPH_VIEW
            </span>
          </div>
          <div className="flex-1 p-4 flex items-center justify-center text-center text-neutral-500 text-xs">
            <span>[ INTERACTIVE GRAPH CANVAS HERE ]</span>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
