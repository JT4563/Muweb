import { create } from "zustand";

export interface Participant {
  userId: string;
  username: string;
  email?: string;
  role: "owner" | "editor" | "viewer";
  color: string;
  isOnline: boolean;
  cursor?: { line: number; column: number };
  selection?: { start: number; end: number };
}

export interface Session {
  id: string;
  title: string;
  description: string;
  language: string;
  owner: string;
  ownerName: string;
  isPublic: boolean;
  code: string;
  participants: Participant[];
  maxParticipants: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface CurrentUser {
  id: string;
  username: string;
  email: string;
  token: string;
}

interface SessionStore {
  // Data
  sessions: Session[];
  currentSession: Session | null;
  currentUser: CurrentUser | null;

  // UI State
  isLoading: boolean;
  error: string | null;
  activePanel: "explorer" | "participants" | "chat" | "history" | null;

  // Actions
  setCurrentSession: (session: Session | null) => void;
  setCurrentUser: (user: CurrentUser | null) => void;
  setSessions: (sessions: Session[]) => void;
  addSession: (session: Session) => void;
  updateSession: (id: string, updates: Partial<Session>) => void;
  updateCode: (code: string) => void;
  addParticipant: (participant: Participant) => void;
  removeParticipant: (userId: string) => void;
  updateParticipant: (userId: string, updates: Partial<Participant>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setActivePanel: (
    panel: "explorer" | "participants" | "chat" | "history" | null
  ) => void;
  reset: () => void;
}

const generateUserColor = () => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E2",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const useSessionStore = create<SessionStore>((set) => ({
  sessions: [],
  currentSession: null,
  currentUser: null,
  isLoading: false,
  error: null,
  activePanel: null,

  setCurrentSession: (session) => set({ currentSession: session }),

  setCurrentUser: (user) => set({ currentUser: user }),

  setSessions: (sessions) => set({ sessions }),

  addSession: (session) =>
    set((state) => ({
      sessions: [session, ...state.sessions],
    })),

  updateSession: (id, updates) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
      currentSession:
        state.currentSession?.id === id
          ? { ...state.currentSession, ...updates }
          : state.currentSession,
    })),

  updateCode: (code) =>
    set((state) => ({
      currentSession: state.currentSession
        ? { ...state.currentSession, code }
        : null,
    })),

  addParticipant: (participant) =>
    set((state) => ({
      currentSession: state.currentSession
        ? {
            ...state.currentSession,
            participants: [
              ...state.currentSession.participants.filter(
                (p) => p.userId !== participant.userId
              ),
              {
                ...participant,
                color: participant.color || generateUserColor(),
              },
            ],
          }
        : null,
    })),

  removeParticipant: (userId) =>
    set((state) => ({
      currentSession: state.currentSession
        ? {
            ...state.currentSession,
            participants: state.currentSession.participants.filter(
              (p) => p.userId !== userId
            ),
          }
        : null,
    })),

  updateParticipant: (userId, updates) =>
    set((state) => ({
      currentSession: state.currentSession
        ? {
            ...state.currentSession,
            participants: state.currentSession.participants.map((p) =>
              p.userId === userId ? { ...p, ...updates } : p
            ),
          }
        : null,
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  setActivePanel: (panel) => set({ activePanel: panel }),

  reset: () =>
    set({
      sessions: [],
      currentSession: null,
      currentUser: null,
      isLoading: false,
      error: null,
      activePanel: null,
    }),
}));
