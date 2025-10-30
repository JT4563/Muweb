import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "./components/ErrorBoundary";
import EditorPage from "./pages/EditorPage";
import "./App.css";

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error("App Error:", error, errorInfo);
        // TODO: Send to Sentry or error tracking service
      }}
    >
      <QueryClientProvider client={queryClient}>
        <EditorPage sessionId="default-session" />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
