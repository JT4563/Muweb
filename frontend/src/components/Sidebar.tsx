import React, { useState } from "react";
import {
  FaLink,
  FaUsers,
  FaFolderOpen,
  FaComments,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useSessionStore } from "../stores/sessionStore";
import SessionListPanel from "./SessionListPanel";
import ParticipantsPanel from "./ParticipantsPanel";
import "./Sidebar.css";

type PanelType = "sessions" | "participants" | "explorer" | "chat" | "history";

export const Sidebar: React.FC = () => {
  const [activePanel, setActivePanel] = useState<PanelType>("sessions");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderPanelContent = () => {
    switch (activePanel) {
      case "sessions":
        return <SessionListPanel />;
      case "participants":
        return <ParticipantsPanel />;
      case "explorer":
        return <ExplorerPanel />;
      case "chat":
        return <ChatPanel />;
      case "history":
        return <HistoryPanel />;
      default:
        return null;
    }
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-icons">
        <button
          className={`sidebar-icon ${
            activePanel === "sessions" ? "active" : ""
          }`}
          onClick={() => setActivePanel("sessions")}
          title="Sessions"
        >
          <FaLink size={18} />
        </button>
        <button
          className={`sidebar-icon ${
            activePanel === "participants" ? "active" : ""
          }`}
          onClick={() => setActivePanel("participants")}
          title="Participants"
        >
          <FaUsers size={18} />
        </button>
        <button
          className={`sidebar-icon ${
            activePanel === "explorer" ? "active" : ""
          }`}
          onClick={() => setActivePanel("explorer")}
          title="File Explorer"
        >
          <FaFolderOpen size={18} />
        </button>
        <button
          className={`sidebar-icon ${activePanel === "chat" ? "active" : ""}`}
          onClick={() => setActivePanel("chat")}
          title="Chat"
        >
          <FaComments size={18} />
        </button>
        <button
          className={`sidebar-icon ${
            activePanel === "history" ? "active" : ""
          }`}
          onClick={() => setActivePanel("history")}
          title="History"
        >
          <FaClock size={18} />
        </button>

        <div className="sidebar-divider" />

        <button
          className="sidebar-icon collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? (
            <FaChevronRight size={16} />
          ) : (
            <FaChevronLeft size={16} />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <div className="sidebar-panel">{renderPanelContent()}</div>
      )}
    </div>
  );
};

const ExplorerPanel: React.FC = () => (
  <div className="panel-content">
    <div className="panel-header">
      <h3>
        <FaFolderOpen style={{ marginRight: "6px" }} />
        Explorer
      </h3>
    </div>
    <div className="empty-message">No files in session</div>
  </div>
);

const ChatPanel: React.FC = () => (
  <div className="panel-content">
    <div className="panel-header">
      <h3>
        <FaComments style={{ marginRight: "6px" }} />
        Chat
      </h3>
    </div>
    <div className="chat-messages" />
    <div className="chat-input">
      <input type="text" placeholder="Type a message..." />
      <button>Send</button>
    </div>
  </div>
);

const HistoryPanel: React.FC = () => {
  const { currentSession } = useSessionStore();

  return (
    <div className="panel-content">
      <div className="panel-header">
        <h3>
          <FaClock style={{ marginRight: "6px" }} />
          Execution History
        </h3>
      </div>
      {!currentSession ? (
        <div className="empty-message">No session selected</div>
      ) : (
        <div className="empty-message">No executions yet</div>
      )}
    </div>
  );
};

export default Sidebar;
