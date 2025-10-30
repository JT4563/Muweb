import React, { useState, useEffect } from "react";
import { FaSync, FaPlus, FaUsers, FaGlobe } from "react-icons/fa";
import { useSessionStore } from "../stores/sessionStore";
import { api } from "../services/api";
import "./SessionListPanel.css";

export const SessionListPanel: React.FC = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    currentSession,
    setCurrentSession,
    setSessions: setSessions2,
  } = useSessionStore();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.sessions.list();
      if (Array.isArray(response.data)) {
        setSessions(response.data);
        setSessions2(response.data as any);
      }
    } catch (err) {
      setError("Failed to load sessions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionClick = async (sessionId: string) => {
    try {
      const response = await api.sessions.get(sessionId);
      if (response.data) {
        setCurrentSession(response.data as any);
        await api.sessions.join(sessionId);
      }
    } catch (err) {
      setError("Failed to join session");
      console.error(err);
    }
  };

  return (
    <div className="session-list-panel">
      <div className="panel-header">
        <h3>
          <FaSync style={{ marginRight: "6px", display: "inline" }} />
          Sessions
        </h3>
        <button className="icon-btn" title="Refresh">
          <FaSync size={14} />
        </button>
      </div>

      {loading && <div className="loading">Loading sessions...</div>}

      {error && <div className="error-message">{error}</div>}

      {!loading && sessions.length === 0 && (
        <div className="empty-state">
          <p>No sessions yet</p>
          <p className="text-sm">Create one to get started</p>
        </div>
      )}

      <div className="sessions-list">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`session-item ${
              currentSession?.id === session.id ? "active" : ""
            }`}
            onClick={() => handleSessionClick(session.id)}
          >
            <div className="session-title">{session.title}</div>
            <div className="session-meta">
              <span className="language">{session.language || "js"}</span>
              <span className="participants">
                <FaUsers size={10} style={{ marginRight: "3px" }} />
                {session.participants?.length || 0}
              </span>
            </div>
            {session.isPublic && (
              <span className="badge">
                <FaGlobe size={10} style={{ marginRight: "4px" }} />
                Public
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="panel-footer">
        <button className="btn-primary" style={{ width: "100%" }}>
          <FaPlus size={12} style={{ marginRight: "6px" }} />
          New Session
        </button>
      </div>
    </div>
  );
};

export default SessionListPanel;
