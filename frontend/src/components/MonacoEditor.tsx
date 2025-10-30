import { useRef, useEffect, useState, useCallback } from "react";
import Editor from "@monaco-editor/react";
import * as Monaco from "monaco-editor";

interface MonacoEditorProps {
  language?: string;
  value?: string;
  onChange?: (value: string) => void;
  theme?: "light" | "dark";
  readOnly?: boolean;
  height?: string;
  onExecute?: () => void;
  isExecuting?: boolean;
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  language = "javascript",
  value = "",
  onChange,
  theme = "dark",
  readOnly = false,
  height = "600px",
  onExecute,
  isExecuting = false,
}) => {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEditorChange = useCallback(
    (val: string | undefined) => {
      if (val !== undefined && onChange) {
        onChange(val);
      }
    },
    [onChange]
  );

  const handleEditorMount = (editor: Monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;

    // Configure keyboard shortcuts
    editor.addCommand(Monaco.KeyMod.CtrlCmd | Monaco.KeyCode.Enter, () => {
      if (onExecute && !isExecuting) {
        onExecute();
      }
    });

    // Auto-format on paste
    editor.onDidPaste(() => {
      editor.getAction("editor.action.formatDocument")?.run();
    });
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-gray-400">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="editor-container relative">
      <Editor
        height={height}
        defaultLanguage={language}
        language={language}
        value={value}
        onChange={handleEditorChange}
        theme={theme === "dark" ? "vs-dark" : "vs-light"}
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
          readOnly: readOnly,
          scrollBeyondLastLine: false,
          smoothScrolling: true,
        }}
        onMount={handleEditorMount}
      />

      {onExecute && !readOnly && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={onExecute}
            disabled={isExecuting}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white rounded transition"
          >
            {isExecuting ? "⏳ Executing..." : "▶ Execute (Ctrl+Enter)"}
          </button>
        </div>
      )}
    </div>
  );
};

export default MonacoEditor;
