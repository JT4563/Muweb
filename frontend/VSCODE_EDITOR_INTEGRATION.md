# VS Code Web Editor Integration Guide

Goal: Integrate VS Code (or Monaco Editor) as a customizable, embeddable code editor into CodeCrafter with collaborative real-time sync, execution, and custom plugins.

## Options for web-based code editors

| Option                        | Pros                                                          | Cons                                  | Best for                             |
| ----------------------------- | ------------------------------------------------------------- | ------------------------------------- | ------------------------------------ |
| **Monaco Editor**             | Lightweight, VS Code features, easy to embed, no build needed | Limited plugin ecosystem              | Embedded editor, quick setup         |
| **VS Code Web** (code-server) | Full VS Code in browser, rich plugins, familiar UX            | Heavier, more resources, needs server | Professional IDE experience          |
| **CodeMirror 6**              | Lightweight, extensible, great performance                    | Less VS Code-like, smaller community  | Minimalist, high-performance editors |

**Recommendation for CodeCrafter:** Start with **Monaco Editor** for fast iteration, then optionally upgrade to **VS Code Web** (code-server) for enterprise users.

---

## Approach 1: Monaco Editor (Recommended for quick launch)

### What is Monaco Editor?

- Same syntax highlighting & IntelliSense engine as VS Code
- Embeddable as a React component
- No server needed; runs in the browser
- Support for 100+ languages, themes, and keyboard shortcuts
- Lightweight (~2-3 MB gzipped)

### Implementation steps

#### 1. Install dependencies

```bash
cd frontend
npm install monaco-editor @monaco-editor/react
npm install -D @types/monaco-editor
```

#### 2. Create a wrapper component (`src/components/CodeEditor/MonacoEditor.tsx`)

```tsx
import { useRef, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  language?: string;
  value?: string;
  onChange?: (value: string) => void;
  theme?: "light" | "dark";
  readOnly?: boolean;
  height?: string;
  onExecute?: () => void;
}

export const MonacoEditor: React.FC<CodeEditorProps> = ({
  language = "javascript",
  value = "",
  onChange,
  theme = "dark",
  readOnly = false,
  height = "600px",
  onExecute,
}) => {
  const editorRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEditorChange = (val: string | undefined) => {
    if (val !== undefined && onChange) {
      onChange(val);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Cmd/Ctrl + Enter to execute
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      onExecute?.();
    }
  };

  if (!mounted) return <div>Loading editor...</div>;

  return (
    <div onKeyDown={handleKeyDown}>
      <Editor
        height={height}
        defaultLanguage={language}
        language={language}
        value={value}
        onChange={handleEditorChange}
        theme={theme === "dark" ? "vs-dark" : "vs"}
        options={{
          minimap: { enabled: true },
          wordWrap: "on",
          formatOnPaste: true,
          formatOnType: true,
          autoClosingBrackets: "always",
          autoClosingQuotes: "always",
          suggestOnTriggerCharacters: true,
          quickSuggestions: { other: true, comments: false, strings: false },
          fontSize: 14,
          lineHeight: 1.6,
          padding: { top: 16, bottom: 16 },
        }}
        onMount={(editor) => {
          editorRef.current = editor;
        }}
      />
    </div>
  );
};
```

#### 3. Real-time collaboration sync (Yjs + Monaco)

For collaborative editing, integrate **Yjs** (CRDT library):

```bash
npm install yjs y-monaco y-websocket
```

```tsx
// src/components/CodeEditor/CollaborativeEditor.tsx
import { useEffect, useRef } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import Editor from "@monaco-editor/react";

interface CollaborativeEditorProps {
  sessionId: string;
  wsUrl: string;
  language?: string;
}

export const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({
  sessionId,
  wsUrl,
  language = "javascript",
}) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Create Yjs document
    const ydoc = new Y.Doc();
    const ytext = ydoc.getText("shared-code");

    // Connect via WebSocket
    const provider = new WebsocketProvider(wsUrl, `session-${sessionId}`, ydoc);

    // Bind Monaco to Yjs
    const binding = new MonacoBinding(
      ytext,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      new Set([provider.awareness])
    );

    return () => {
      binding.destroy();
      provider.disconnect();
      ydoc.destroy();
    };
  }, [sessionId, wsUrl]);

  return (
    <Editor
      height="600px"
      defaultLanguage={language}
      defaultValue="// Start typing..."
      onMount={(editor) => {
        editorRef.current = editor;
      }}
      theme="vs-dark"
    />
  );
};
```

#### 4. Language server protocol (LSP) for advanced features

For linting, type-checking, and IntelliSense, set up LSP:

```bash
npm install @monaco-languageclient @typefoundry/monaco-languageclient
```

This allows you to connect to external language servers (e.g., Pylance for Python, ESLint for JS).

---

## Approach 2: VS Code Web (code-server)

### What is code-server?

- Full VS Code running in a browser
- Runs on a remote server (Docker container)
- Support for all VS Code extensions
- Heavy resource usage (~2-4 GB RAM per session)

### Implementation steps

#### 1. Deploy code-server in Docker

Add to `backend/docker-compose.yml`:

```yaml
code-server:
  image: codercom/code-server:latest
  container_name: codeserver
  environment:
    - PASSWORD=codecrafter123
    - SUDO_PASSWORD=codecrafter123
  ports:
    - "8443:8080"
  volumes:
    - /tmp/codecrafter/workspaces:/home/coder/project
  networks:
    - codecrafter-network
  restart: unless-stopped
```

#### 2. Reverse proxy via Nginx

Add to `backend/nginx.conf`:

```nginx
location /code {
  proxy_pass http://code-server:8080;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
}
```

#### 3. Embed in iframe

```tsx
// src/pages/Editor/VSCodeEditor.tsx
export const VSCodeEditor = ({ sessionId }: { sessionId: string }) => {
  return (
    <iframe
      src={`http://localhost/code?workspace=${sessionId}`}
      style={{ width: "100%", height: "100%", border: "none" }}
      allow="accelerometer; camera; microphone; payment; usb"
    />
  );
};
```

---

## Approach 3: Hybrid (Recommended for production)

Use **Monaco Editor** as the primary editor (fast, lightweight), and optionally offer **code-server** for power users in a separate tab or modal.

```tsx
// src/pages/Editor/EditorSwitcher.tsx
import { useState } from "react";
import { MonacoEditor } from "./MonacoEditor";
import { VSCodeEditor } from "./VSCodeEditor";

export const EditorSwitcher = ({ sessionId }: { sessionId: string }) => {
  const [editorMode, setEditorMode] = useState<"monaco" | "vscode">("monaco");

  return (
    <div>
      <div className="editor-tabs">
        <button
          onClick={() => setEditorMode("monaco")}
          className={editorMode === "monaco" ? "active" : ""}
        >
          Quick Editor (Monaco)
        </button>
        <button
          onClick={() => setEditorMode("vscode")}
          className={editorMode === "vscode" ? "active" : ""}
        >
          Full IDE (VS Code)
        </button>
      </div>
      {editorMode === "monaco" ? (
        <MonacoEditor sessionId={sessionId} />
      ) : (
        <VSCodeEditor sessionId={sessionId} />
      )}
    </div>
  );
};
```

---

## Integration with CodeCrafter backend

### 1. Send code to execution service

```tsx
// src/hooks/useCodeExecution.ts
import { useMutation } from "@tanstack/react-query";
import api from "../services/api";

export const useCodeExecution = () => {
  return useMutation({
    mutationFn: async (payload: {
      language: string;
      code: string;
      input?: string;
    }) => {
      const response = await api.post("/api/execute/run", payload);
      return response.data;
    },
    onError: (error) => {
      console.error("Code execution failed:", error);
      // Show error to user via toast/modal
    },
  });
};
```

### 2. WebSocket sync for real-time collaboration

```tsx
// src/services/websocket.ts
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});

socket.on("code:update", (data) => {
  // Sync code from other users
});

socket.emit("code:change", { sessionId, code, userId });
```

---

## Security considerations

1. **Sandboxing code execution**: Never execute user code directly; always run in isolated containers (which your backend already does via Docker).
2. **LSP/Extension sandboxing**: If using LSP, ensure language servers run in separate processes with resource limits.
3. **File access control**: Restrict editor file access to the session workspace only (no access to `/etc`, home, etc.).
4. **Authentication**: Require JWT auth for WebSocket and code execution endpoints.

---

## Performance optimization

1. **Lazy-load Monaco**: Use dynamic imports to reduce initial bundle size.

   ```tsx
   const MonacoEditor = lazy(() => import("@monaco-editor/react"));
   ```

2. **Worker threads**: Offload syntax highlighting and heavy parsing to a Web Worker.

3. **Caching**: Cache language definitions, themes, and snippets.

4. **CDN**: Serve Monaco from CDN instead of bundling.

---

## Folder structure with editor integration

```
frontend/
├─ src/
│  ├─ pages/
│  │  └─ Editor/
│  │     ├─ Editor.tsx           // Main page
│  │     └─ EditorSwitcher.tsx   // Monaco vs VS Code toggle
│  ├─ components/
│  │  ├─ CodeEditor/
│  │  │  ├─ MonacoEditor.tsx     // Wrapper
│  │  │  ├─ CollaborativeEditor.tsx
│  │  │  └─ VSCodeEditor.tsx
│  │  └─ ExecutionPanel.tsx
│  ├─ hooks/
│  │  ├─ useCodeExecution.ts
│  │  └─ useCollaboration.ts
│  └─ services/
│     ├─ api.ts
│     └─ websocket.ts
```

---

## Quick start commands

### Option A: Monaco Editor (fast)

```bash
cd frontend
npm create vite@latest . -- --template react-ts
npm install monaco-editor @monaco-editor/react yjs y-monaco y-websocket
npm run dev
```

### Option B: VS Code Web (full IDE)

```bash
cd backend
docker-compose up -d code-server
# Access at http://localhost:8443 (password: codecrafter123)
```

### Option C: Both (recommended)

```bash
# Do both setups; use feature flags/env vars to toggle
```

---

## Next steps

1. **Scaffold frontend** with Vite + React + TS + Monaco Editor.
2. **Implement API service** that connects to `/api/execute/run`.
3. **Add real-time sync** with Yjs + WebSocket.
4. **Test execution flow**: write code → execute → see output.
5. **Add optional VS Code** for power users (later phase).
6. **Deploy to production** with proper CSP and auth.

---

## Recommended next action

I can scaffold the full frontend starter (Vite + React + TypeScript + Monaco Editor + Yjs) and a GitHub Actions pipeline right now. Should I proceed?

---

## References

- Monaco Editor: https://microsoft.github.io/monaco-editor/
- Yjs: https://docs.yjs.dev/
- code-server: https://github.com/coder/code-server
- y-monaco binding: https://docs.yjs.dev/ecosystem/monaco
