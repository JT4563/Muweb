import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 1000;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = io(SOCKET_URL, {
        reconnection: true,
        reconnectionDelay: this.reconnectDelay,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: this.maxReconnectAttempts,
        transports: ["websocket", "polling"],
        auth: {
          token: localStorage.getItem("authToken"),
        },
      });

      this.socket.on("connect", () => {
        console.log("✅ WebSocket connected");
        this.reconnectAttempts = 0;
        resolve();
      });

      this.socket.on("disconnect", (reason) => {
        console.warn("❌ WebSocket disconnected:", reason);
      });

      this.socket.on("reconnect_attempt", () => {
        this.reconnectAttempts++;
        console.log(`🔄 Reconnection attempt ${this.reconnectAttempts}`);
      });

      this.socket.on("error", (error) => {
        console.error("⚠️ WebSocket error:", error);
        reject(error);
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event: string, data?: any): void {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  // Session-specific methods
  joinSession(sessionId: string): void {
    this.emit("session:join", { sessionId });
  }

  leaveSession(sessionId: string): void {
    this.emit("session:leave", { sessionId });
  }

  // Code collaboration events
  subscribeToCodeChanges(
    sessionId: string,
    callback: (data: {
      code: string;
      userId: string;
      timestamp: number;
    }) => void
  ): void {
    this.on(`code:change:${sessionId}`, callback);
  }

  unsubscribeFromCodeChanges(sessionId: string): void {
    this.off(`code:change:${sessionId}`);
  }

  sendCodeChange(sessionId: string, code: string): void {
    this.emit("code:change", {
      sessionId,
      code,
      timestamp: Date.now(),
    });
  }

  // Cursor position tracking
  subscribeToCursorUpdates(
    sessionId: string,
    callback: (data: {
      userId: string;
      line: number;
      column: number;
      username: string;
    }) => void
  ): void {
    this.on(`code:cursor:${sessionId}`, callback);
  }

  unsubscribeFromCursorUpdates(sessionId: string): void {
    this.off(`code:cursor:${sessionId}`);
  }

  sendCursorUpdate(sessionId: string, line: number, column: number): void {
    this.emit("code:cursor", {
      sessionId,
      line,
      column,
      timestamp: Date.now(),
    });
  }

  // Selection tracking
  subscribeToSelectionUpdates(
    sessionId: string,
    callback: (data: {
      userId: string;
      startLine: number;
      startColumn: number;
      endLine: number;
      endColumn: number;
      username: string;
    }) => void
  ): void {
    this.on(`code:selection:${sessionId}`, callback);
  }

  unsubscribeFromSelectionUpdates(sessionId: string): void {
    this.off(`code:selection:${sessionId}`);
  }

  sendSelectionUpdate(
    sessionId: string,
    startLine: number,
    startColumn: number,
    endLine: number,
    endColumn: number
  ): void {
    this.emit("code:selection", {
      sessionId,
      startLine,
      startColumn,
      endLine,
      endColumn,
      timestamp: Date.now(),
    });
  }

  // Participant events
  onParticipantJoined(
    sessionId: string,
    callback: (participant: any) => void
  ): void {
    this.on(`session:participant:joined:${sessionId}`, callback);
  }

  onParticipantLeft(
    sessionId: string,
    callback: (userId: string) => void
  ): void {
    this.on(`session:participant:left:${sessionId}`, callback);
  }

  onParticipantUpdated(
    sessionId: string,
    callback: (participant: any) => void
  ): void {
    this.on(`session:participant:updated:${sessionId}`, callback);
  }

  offParticipantJoined(sessionId: string): void {
    this.off(`session:participant:joined:${sessionId}`);
  }

  offParticipantLeft(sessionId: string): void {
    this.off(`session:participant:left:${sessionId}`);
  }

  offParticipantUpdated(sessionId: string): void {
    this.off(`session:participant:updated:${sessionId}`);
  }

  // Execution result listening
  onExecutionStart(
    sessionId: string,
    callback: (data: { userId: string; timestamp: number }) => void
  ): void {
    this.on(`execution:start:${sessionId}`, callback);
  }

  onExecutionResult(
    sessionId: string,
    callback: (result: {
      output: string;
      error: string | null;
      executionTime: number;
      userId: string;
      timestamp: number;
    }) => void
  ): void {
    this.on(`execution:result:${sessionId}`, callback);
  }

  offExecutionStart(sessionId: string): void {
    this.off(`execution:start:${sessionId}`);
  }

  offExecutionResult(sessionId: string): void {
    this.off(`execution:result:${sessionId}`);
  }

  // Chat/activity events
  onChatMessage(
    sessionId: string,
    callback: (message: {
      userId: string;
      username: string;
      message: string;
      timestamp: number;
    }) => void
  ): void {
    this.on(`chat:message:${sessionId}`, callback);
  }

  sendChatMessage(sessionId: string, message: string): void {
    this.emit("chat:message", { sessionId, message });
  }

  offChatMessage(sessionId: string): void {
    this.off(`chat:message:${sessionId}`);
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const ws = new WebSocketService();
export default ws;
