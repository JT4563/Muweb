import React, { useEffect, useState } from "react";
import { FaUsers, FaCrown, FaPen, FaEye } from "react-icons/fa";
import { useSessionStore } from "../stores/sessionStore";
import "./ParticipantsPanel.css";

export const ParticipantsPanel: React.FC = () => {
  const { currentSession } = useSessionStore();
  const [participants, setParticipants] = useState<any[]>([]);

  useEffect(() => {
    if (currentSession?.participants) {
      setParticipants(currentSession.participants);
    }
  }, [currentSession]);

  if (!currentSession) {
    return (
      <div className="participants-panel empty">
        <div className="panel-header">
          <h3>
            <FaUsers style={{ marginRight: "6px", display: "inline" }} />
            Participants
          </h3>
        </div>
        <div className="empty-message">No session selected</div>
      </div>
    );
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <FaCrown size={12} />;
      case "editor":
        return <FaPen size={12} />;
      case "viewer":
        return <FaEye size={12} />;
      default:
        return null;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "owner":
        return "Owner";
      case "editor":
        return "Editor";
      case "viewer":
        return "Viewer";
      default:
        return role;
    }
  };

  return (
    <div className="participants-panel">
      <div className="panel-header">
        <h3>
          <FaUsers style={{ marginRight: "6px", display: "inline" }} />
          Participants
        </h3>
        <span className="participant-count">{participants.length}</span>
      </div>

      <div className="participants-list">
        {participants.map((participant, idx) => (
          <div key={participant.id || idx} className="participant-item">
            <div
              className="participant-avatar"
              style={{ backgroundColor: participant.color || "#888" }}
              title={participant.username}
            >
              {participant.username?.charAt(0).toUpperCase() || "?"}
            </div>
            <div className="participant-info">
              <div className="participant-name">
                {participant.username || "Unknown"}
              </div>
              <div className="participant-role">
                <span style={{ marginRight: "4px", display: "inline" }}>
                  {getRoleIcon(participant.role)}
                </span>
                {getRoleLabel(participant.role)}
              </div>
            </div>
            <div className="participant-status">
              {participant.isOnline ? (
                <span className="status-badge online" title="Online">
                  ●
                </span>
              ) : (
                <span className="status-badge offline" title="Offline">
                  ○
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {participants.length === 0 && (
        <div className="empty-message">No participants yet</div>
      )}

      <div className="panel-footer">
        <div className="info-text">
          <strong>Role Legend:</strong>
          <div className="legend-item">
            <FaCrown
              size={10}
              style={{ marginRight: "4px", display: "inline" }}
            />
            Owner - Session creator, full control
          </div>
          <div className="legend-item">
            <FaPen
              size={10}
              style={{ marginRight: "4px", display: "inline" }}
            />
            Editor - Can edit code
          </div>
          <div className="legend-item">
            <FaEye
              size={10}
              style={{ marginRight: "4px", display: "inline" }}
            />
            Viewer - Read-only access
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsPanel;
