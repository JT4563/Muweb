import axios from "axios";
import type { AxiosInstance, AxiosError } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const REQUEST_TIMEOUT = 30000;

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ExecuteCodePayload {
  language: string;
  code: string;
  input?: string;
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  errors?: string;
  executionTime: number;
  language: string;
}

// Retry configuration
const retryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000,
  backoffMultiplier: 2,
  maxDelayMs: 10000,
};

// Create axios instance with default config
const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Exponential backoff with jitter
const exponentialBackoff = async (attempt: number) => {
  const delay = Math.min(
    retryConfig.initialDelayMs *
      Math.pow(retryConfig.backoffMultiplier, attempt - 1),
    retryConfig.maxDelayMs
  );
  // Add jitter (random 0-25% variance)
  const jitter = delay * 0.25 * Math.random();
  await new Promise((resolve) => setTimeout(resolve, delay + jitter));
};

// Request interceptor: Add auth token if available
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle errors and retry logic
client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as any;

    // Don't retry if no config or if already retried max times
    if (!config || !config.retry) {
      config.retry = 0;
    }

    config.retry += 1;

    // Only retry GET requests and specific error codes
    const shouldRetry =
      config.method === "GET" &&
      config.retry <= retryConfig.maxRetries &&
      (error.response?.status === 408 || // Request timeout
        error.response?.status === 429 || // Too many requests
        error.response?.status === 503 || // Service unavailable
        error.response?.status === 504 || // Gateway timeout
        error.code === "ECONNABORTED" ||
        error.code === "ENOTFOUND" ||
        error.code === "ECONNREFUSED");

    if (shouldRetry) {
      await exponentialBackoff(config.retry);
      return client(config);
    }

    return Promise.reject(error);
  }
);

// API methods
export const api = {
  // Health check
  health: async () => {
    return client.get<ApiResponse<{ status: string }>>("/health");
  },

  // Auth endpoints
  auth: {
    signup: (email: string, password: string, name: string) =>
      client.post<ApiResponse<{ token: string; refreshToken: string }>>(
        "/api/auth/signup",
        {
          email,
          password,
          name,
        }
      ),

    login: (email: string, password: string) =>
      client.post<ApiResponse<{ token: string; refreshToken: string }>>(
        "/api/auth/login",
        {
          email,
          password,
        }
      ),

    logout: () =>
      client.post<ApiResponse<{ message: string }>>("/api/auth/logout"),

    refresh: (refreshToken: string) =>
      client.post<ApiResponse<{ token: string }>>("/api/auth/refresh", {
        refreshToken,
      }),
  },

  // Sessions endpoints
  sessions: {
    list: () => client.get<ApiResponse<any[]>>("/api/sessions"),

    create: (payload: {
      title: string;
      description?: string;
      language?: string;
      isPublic?: boolean;
      maxParticipants?: number;
    }) => client.post<ApiResponse<any>>("/api/sessions", payload),

    get: (sessionId: string) =>
      client.get<ApiResponse<any>>(`/api/sessions/${sessionId}`),

    join: (sessionId: string) =>
      client.post<ApiResponse<any>>(`/api/sessions/${sessionId}/join`),

    leave: (sessionId: string) =>
      client.post<ApiResponse<any>>(`/api/sessions/${sessionId}/leave`),

    fork: (sessionId: string, title: string) =>
      client.post<ApiResponse<any>>(`/api/sessions/${sessionId}/fork`, {
        title,
      }),

    updateParticipantRole: (
      sessionId: string,
      userId: string,
      role: "owner" | "editor" | "viewer"
    ) =>
      client.put<ApiResponse<any>>(
        `/api/sessions/${sessionId}/participants/${userId}/role`,
        { role }
      ),

    removeParticipant: (sessionId: string, userId: string) =>
      client.delete<ApiResponse<any>>(
        `/api/sessions/${sessionId}/participants/${userId}`
      ),

    getSnapshots: (sessionId: string) =>
      client.get<ApiResponse<any[]>>(`/api/sessions/${sessionId}/snapshots`),

    createSnapshot: (sessionId: string, title: string) =>
      client.post<ApiResponse<any>>(`/api/sessions/${sessionId}/snapshots`, {
        title,
      }),

    restoreSnapshot: (sessionId: string, snapshotId: string) =>
      client.post<ApiResponse<any>>(
        `/api/sessions/${sessionId}/snapshots/${snapshotId}/restore`
      ),
  },

  // Execute endpoints
  execute: {
    run: (payload: ExecuteCodePayload) =>
      client.post<ApiResponse<ExecutionResult>>("/api/execute/run", payload),

    history: () => client.get<ApiResponse<any[]>>("/api/execute/history"),
  },
};

export default client;
