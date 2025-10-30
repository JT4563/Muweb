# 🚀 Collaborative Session Features - Implementation Guide

## Overview

The frontend now fully supports collaborative sessions with real-time code sharing, participant tracking, and a VS Code-like UI. Multiple users can join the same session, see each other's presence, and collaborate on code execution.

## Architecture

### Components Structure

```
src/components/
├── Sidebar.tsx                    # Main sidebar with icon navigation
├── Sidebar.css                    # Sidebar styling
├── SessionListPanel.tsx           # Session management panel
├── SessionListPanel.css           # Session list styling
├── ParticipantsPanel.tsx          # Active participants display
├── ParticipantsPanel.css          # Participants styling
├── MonacoEditor.tsx               # Code editor component
├── ErrorBoundary.tsx              # Error handling component
```

### Services

#### `src/services/api.ts`

Complete API client with endpoints for:

- **Sessions**: list, create, get, join, leave, fork, update roles, get snapshots
- **Auth**: signup, login, logout, refresh token
- **Execute**: run code, get history

#### `src/services/websocket.ts`

Real-time communication with events:

- **Session events**: join, leave, participant updates
- **Code events**: code changes, cursor positions, selections
- **Execution**: start, results
- **Chat**: messages
- **Participant tracking**: online status, cursors, selections

### State Management

#### `src/stores/sessionStore.ts` (Zustand)

Centralized state for:

- Current session and user
- Participant list with roles (owner/editor/viewer)
- Code content and language
- UI panel state (sessions/participants/chat/history/explorer)
- 56+ actions for state management

### Pages

#### `src/pages/EditorPage.tsx`

Main editor interface featuring:

- **Header**: Connection status, language selector, execute button
- **Sidebar**: VS Code-style icon navigation
- **Editor**: Monaco with real-time code sync
- **Output**: Execution results and participant count

## Features Implemented

### ✅ Session Management

- **Create Sessions**: Users can create new collaborative sessions
- **Join Sessions**: Browse and join existing sessions by ID
- **Leave Sessions**: Exit sessions gracefully
- **Fork Sessions**: Create snapshots of sessions

### ✅ Participant Tracking

- **Live Presence**: See who's online in real-time
- **User Roles**: Owner, Editor, Viewer with different permissions
- **Unique Colors**: Each participant gets a unique color avatar
- **Status Indicators**: Green dot (online), gray dot (offline)

### ✅ Real-time Code Collaboration

- **Instant Sync**: Code changes broadcast to all participants via WebSocket
- **Code Events**:
  - `code:change` - When code is updated
  - `code:cursor` - Cursor position tracking
  - `code:selection` - Selection/highlight tracking

### ✅ Execution Sharing

- **Shared Execution**: Run code and see results shared across session
- **Execution Events**:
  - `execution:start` - When execution begins
  - `execution:result` - When results are ready with userId and timestamp

### ✅ VS Code-like UI

**Sidebar with 5 panels:**

1. **🔗 Sessions** - Browse and manage sessions
2. **👥 Participants** - See active collaborators with roles and colors
3. **📁 Explorer** - File management (placeholder for future)
4. **💬 Chat** - Team chat (placeholder for future)
5. **⏱️ History** - Execution history (placeholder for future)

**Collapsible sidebar** with icon-based navigation for quick access

## Data Models

### Session

```typescript
interface Session {
  id: string;
  title: string;
  description?: string;
  language: string;
  owner: Participant;
  isPublic: boolean;
  code: string;
  participants: Participant[];
  maxParticipants?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Participant

```typescript
interface Participant {
  id: string;
  userId: string;
  username: string;
  email: string;
  role: "owner" | "editor" | "viewer";
  color: string; // Unique hex color
  isOnline: boolean;
  cursor?: { line: number; column: number };
  selection?: { start: number; end: number };
  joinedAt: Date;
}
```

### CurrentUser

```typescript
interface CurrentUser {
  id: string;
  username: string;
  email: string;
  token: string;
}
```

## WebSocket Event Flow

### Joining a Session

```
1. User clicks "Join" on session
2. API call: POST /api/sessions/:id/join
3. WebSocket emits: "session:join"
4. Backend adds participant to room
5. All clients receive: "session:participant:joined:$sessionId"
6. ParticipantsPanel updates with new participant
```

### Code Changes

```
1. User edits code in Monaco
2. onChange handler triggers: handleCodeChange()
3. WebSocket emit: "code:change" { sessionId, code, timestamp }
4. Backend broadcasts to room
5. Other clients receive: "code:change:$sessionId"
6. Code updates in their editor
```

### Execution

```
1. User clicks Execute or Ctrl+Enter
2. API call: POST /api/execute/run { language, code }
3. WebSocket emit: "execution:start"
4. Code runs on backend
5. Clients receive: "execution:result:$sessionId" with output
6. Results display in Output panel
```

## Integration Points

### Frontend → Backend API

```typescript
// Session endpoints
api.sessions.list(); // GET /api/sessions
api.sessions.create(payload); // POST /api/sessions
api.sessions.get(sessionId); // GET /api/sessions/:id
api.sessions.join(sessionId); // POST /api/sessions/:id/join
api.sessions.leave(sessionId); // POST /api/sessions/:id/leave
api.sessions.fork(sessionId, title); // POST /api/sessions/:id/fork
api.sessions.updateParticipantRole(); // PUT /api/sessions/:id/participants/:uid/role

// Execute endpoints
api.execute.run(payload); // POST /api/execute/run
api.execute.history(); // GET /api/execute/history
```

### WebSocket Events

```typescript
// Emit (to backend)
ws.sendCodeChange(sessionId, code);
ws.sendCursorUpdate(sessionId, line, column);
ws.sendSelectionUpdate(sessionId, startLine, startCol, endLine, endCol);
ws.sendChatMessage(sessionId, message);

// Listen (from backend)
ws.subscribeToCodeChanges(sessionId, callback);
ws.subscribeToCursorUpdates(sessionId, callback);
ws.subscribeToSelectionUpdates(sessionId, callback);
ws.onParticipantJoined(sessionId, callback);
ws.onParticipantLeft(sessionId, callback);
ws.onExecutionResult(sessionId, callback);
ws.onChatMessage(sessionId, callback);
```

## Styling

### CSS Variables (Dark Theme)

```css
--bg-primary: #1e1e1e       /* Main background */
--bg-secondary: #252526     /* Secondary panels */
--bg-tertiary: #2d2d30      /* Headers, footers */
--bg-hover: #3e3e42         /* Hover state */
--text-primary: #d4d4d4     /* Main text */
--text-secondary: #858585   /* Secondary text */
--text-tertiary: #6a6a6a    /* Tertiary text */
--border-color: #3e3e42     /* Borders */
--accent-color: #007acc     /* Blue accent */
--error-color: #f48771      /* Error red */
```

## Usage Examples

### Creating a New Session

```typescript
const handleCreateSession = async () => {
  const response = await api.sessions.create({
    title: "React Learning Session",
    description: "Learning React hooks",
    language: "javascript",
    isPublic: true,
    maxParticipants: 5,
  });

  const newSession = response.data;
  setCurrentSession(newSession);
};
```

### Listening to Participant Updates

```typescript
useEffect(() => {
  ws.onParticipantJoined(sessionId, (participant) => {
    // Update participants list
    addParticipant(participant);
  });

  return () => ws.offParticipantJoined(sessionId);
}, [sessionId]);
```

### Sending Code Changes

```typescript
const handleCodeChange = (newCode: string) => {
  setCode(newCode);
  ws.sendCodeChange(sessionId, newCode);
};
```

## Testing Collaborative Features

### Multi-Client Testing

1. Open two browser windows (or incognito windows)
2. Sign in with different users or same user in both windows
3. Create a session in the first window
4. Join the same session in the second window
5. Edit code in one window
6. Verify code updates instantly in the other window
7. Check participant list shows both users

### Connection Handling

- Test offline scenarios by disconnecting network
- Verify automatic reconnection with 10 retry attempts
- Check WebSocket reconnection delay increases (1s, 2s, 4s, etc.)

### Execution Sharing

- Run code in one client
- Verify results appear in all clients' output panels
- Check userId and timestamp are tracked correctly

## Performance Optimizations

### Bundle Size

- **Main chunk**: 3.5MB (gzipped: 913KB) - Monaco Editor dominates
- **Recommended**: Implement code-splitting for language support
  ```typescript
  // Dynamic import language models
  const loadLanguageSupport = (lang) => import(`./languages/${lang}.js`);
  ```

### Network Optimization

- **Debounce code changes**: Batch cursor position updates
- **Selective listener registration**: Only listen to current session events
- **Cleanup on unmount**: Remove WebSocket listeners to prevent memory leaks

### State Optimization

- Use Zustand selectors to prevent unnecessary re-renders
- Memoize participant list components
- Use useCallback for event handlers

## Future Enhancements

### Phase 2: CRDT Integration

- Integrate Yjs for operational transformation
- Bind Monaco Editor to Yjs model
- Full offline support with automatic sync

### Phase 3: Advanced Features

- **Comments/Annotations**: Inline code reviews
- **Session Recording**: Replay session history
- **Diff Viewer**: See who changed what
- **Permissions**: Fine-grained role management
- **Activity Log**: Timeline of all changes

### Phase 4: Scaling

- **Pub/Sub System**: Redis for multi-server broadcasting
- **Session Archival**: Store completed sessions
- **Analytics**: Track session activity and participants
- **Billing**: Usage-based pricing

## Troubleshooting

### WebSocket Connection Failed

```typescript
// Check auth token is in localStorage
console.log(localStorage.getItem("authToken"));

// Verify backend WebSocket is accepting connections
// Check backend logs for "WebSocket connected" messages
```

### Code Changes Not Syncing

1. Verify both clients are connected (green dot)
2. Check network tab for WebSocket messages
3. Verify session IDs match between clients
4. Check browser console for errors

### Participants Not Appearing

1. Ensure join request succeeded (API 200 response)
2. Check if participant role is correct
3. Verify WebSocket is listening to participant events
4. Manually refresh participant list

## Environment Configuration

### Development (.env)

```
VITE_API_URL=http://localhost:8000
VITE_SOCKET_URL=http://localhost:8000
```

### Production (.env.production)

```
VITE_API_URL=https://api.codecrafter.io
VITE_SOCKET_URL=https://api.codecrafter.io
```

## API Documentation Links

- Backend session routes: `backend/api/sessions.routes.js`
- WebSocket handlers: `backend/websocket/socket.server.js`
- Session controller: `backend/controllers/sessions.controller.js`
- Session model: `backend/models/session.model.js`

---

**Last Updated**: 2024
**Status**: ✅ Collaborative features fully implemented and tested
