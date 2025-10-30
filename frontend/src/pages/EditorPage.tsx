import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  FaCode,
  FaCircle,
  FaPlay,
  FaHourglass,
  FaExclamationCircle,
  FaUsers,
} from "react-icons/fa";
import MonacoEditor from "../components/MonacoEditor";
import Sidebar from "../components/Sidebar";
import { useExecuteCode } from "../hooks/useExecuteCode";
import { useSessionStore } from "../stores/sessionStore";
import ws from "../services/websocket";
import type { ExecutionResult } from "../services/api";
import "./EditorPage.css";

interface EditorPageProps {
  sessionId?: string;
}

export const EditorPage: React.FC<EditorPageProps> = ({
  sessionId = "default",
}) => {
  const [code, setCode] = useState<string>(
    '// Write your code here\nconsole.log("Hello, World!");'
  );
  const [language, setLanguage] = useState<string>("javascript");
  const [output, setOutput] = useState<string>("");
  const [executionResult, setExecutionResult] =
    useState<ExecutionResult | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [remoteParticipants, setRemoteParticipants] = useState<
    Map<string, any>
  >(new Map());

  const executeCodeMutation = useExecuteCode();
  const queryClient = useQueryClient();
  const { currentSession } = useSessionStore();

  // Connect to WebSocket on mount
  useEffect(() => {
    const connectWebSocket = async () => {
      try {
        await ws.connect();
        setIsConnected(true);
        ws.joinSession(sessionId);

        // Listen for code updates from other users
        ws.subscribeToCodeChanges(sessionId, (data) => {
          setCode(data.code);
        });

        // Listen for participant joined
        ws.onParticipantJoined(sessionId, (participant) => {
          setRemoteParticipants((prev) => {
            const updated = new Map(prev);
            updated.set(participant.userId, participant);
            return updated;
          });
        });

        // Listen for participant left
        ws.onParticipantLeft(sessionId, (userId) => {
          setRemoteParticipants((prev) => {
            const updated = new Map(prev);
            updated.delete(userId);
            return updated;
          });
        });

        // Listen for execution results
        ws.onExecutionResult(sessionId, (result: any) => {
          setExecutionResult(result as ExecutionResult);
          setOutput(result.output);
        });
      } catch (error) {
        console.error("Failed to connect WebSocket:", error);
        setIsConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      ws.leaveSession(sessionId);
      ws.disconnect();
      setIsConnected(false);
    };
  }, [sessionId]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    // Broadcast code change to other users
    if (isConnected) {
      ws.sendCodeChange(sessionId, newCode);
    }
  };

  const handleExecute = async () => {
    try {
      const result = await executeCodeMutation.mutateAsync({
        language,
        code,
      });

      setExecutionResult(result);
      setOutput(result.output);

      // Invalidate history to refresh it
      queryClient.invalidateQueries({ queryKey: ["executionHistory"] });
    } catch (error) {
      console.error("Execution error:", error);
      setOutput("Error executing code. Check console for details.");
    }
  };

  return (
    <div className="editor-container">
      {/* Header */}
      <header className="editor-header">
        <div className="header-left">
          <div className="header-branding">
            <FaCode className="app-icon" />
            <h1 className="app-title">CodeCrafter</h1>
          </div>

          <div className="connection-status">
            <FaCircle
              className={`status-indicator ${
                isConnected ? "connected" : "disconnected"
              }`}
              size={10}
            />
            <span className="status-text">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>

          {currentSession && (
            <div className="session-info">
              <span className="session-label">Session:</span>
              <span className="session-name">{currentSession.title}</span>
            </div>
          )}
        </div>

        <div className="header-right">
          <div className="control-group">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="language-select"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
              <option value="typescript">TypeScript</option>
            </select>

            <button
              onClick={handleExecute}
              disabled={executeCodeMutation.isPending}
              className="execute-button"
              title="Execute code (Ctrl+Enter)"
            >
              <FaPlay size={14} />
              <span>
                {executeCodeMutation.isPending ? "Running..." : "Execute"}
              </span>
            </button>
          </div>

          <div className="participants-badge">
            <FaUsers size={14} />
            <span>{remoteParticipants.size + 1}</span>
          </div>
        </div>
      </header>

      {/* Main Editor Area */}
      <div className="editor-main">
        {/* Sidebar */}
        <div className="editor-sidebar">
          <Sidebar />
        </div>

        {/* Code Editor Panel */}
        <div className="editor-panel">
          <div className="panel-header">
            <span className="panel-title">Code Editor</span>
            <span className="language-badge">{language}</span>
          </div>
          <div className="panel-content">
            <MonacoEditor
              language={language}
              value={code}
              onChange={handleCodeChange}
              onExecute={handleExecute}
              isExecuting={executeCodeMutation.isPending}
              height="100%"
              theme="dark"
            />
          </div>
        </div>

        {/* Output Panel */}
        <div className="output-panel">
          <div className="panel-header">
            <span className="panel-title">Output</span>
          </div>

          <div className="output-content">
            <pre className="output-text">{output || "(No output yet)"}</pre>
          </div>

          {executionResult && (
            <div className="execution-meta">
              <div className="meta-item">
                <FaHourglass size={12} />
                <span>{executionResult.executionTime}ms</span>
              </div>
              {executionResult.errors && (
                <div className="meta-error">
                  <FaExclamationCircle size={12} />
                  <span>{executionResult.errors}</span>
                </div>
              )}
            </div>
          )}

          {executeCodeMutation.error && (
            <div className="error-message">
              <FaExclamationCircle size={14} />
              <span>
                {(executeCodeMutation.error as any).response?.data?.error ||
                  "Execution failed"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
