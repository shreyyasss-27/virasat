import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

/* ---------------- TYPES ---------------- */

export interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export interface Conversation {
  _id?: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
}

interface ChatStore {
  conversations: Conversation[];
  activeConversation: Conversation | null;

  isLoadingChats: boolean;
  isSendingMessage: boolean;
  isDeletingChat: boolean;
  isRenamingChat: boolean;
  isSearching: boolean;

  fetchChatHistory: () => Promise<void>;
  searchChats: (query: string) => Promise<void>;
  getConversation: (id: string) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  deleteChat: (id: string) => Promise<void>;
  renameChat: (id: string, title: string) => Promise<void>;
  clearActiveChat: () => void;
  resetChatStore: () => void;
}

/* ---------------- STORE ---------------- */

export const useChatStore = create<ChatStore>((set, get) => ({

  conversations: [],
  activeConversation: {
    title: "New Chat",
    createdAt: new Date().toISOString(),
    messages: []
  },

  isLoadingChats: false,
  isSendingMessage: false,
  isDeletingChat: false,
  isRenamingChat: false,
  isSearching: false,

  /* ---------------- HISTORY ---------------- */

  fetchChatHistory: async () => {
    set({ isLoadingChats: true });
    try {
      const res = await axiosInstance.get("/chat/history");
      set({ conversations: res.data });
    } catch {
      toast.error("Failed to load history");
    } finally {
      set({ isLoadingChats: false });
    }
  },

  /* ---------------- SEARCH ---------------- */

  searchChats: async (query: string) => {
    if (!query.trim()) return get().fetchChatHistory();

    set({ isSearching: true });
    try {
      const res = await axiosInstance.get(`/chat/history?q=${encodeURIComponent(query)}`);
      set({ conversations: res.data });
    } catch {
      toast.error("Search failed");
    } finally {
      set({ isSearching: false });
    }
  },

  /* ---------------- LOAD CHAT ---------------- */

  getConversation: async (id: string) => {
    try {
      if(id === "") return;
      const res = await axiosInstance.get(`/chat/${id}`);
      set({ activeConversation: res.data });
    } catch {
      toast.error("Failed to open chat");
    }
  },

  /* ---------------- SEND MESSAGE ---------------- */

  sendMessage: async (message: string) => {

    if (!message.trim()) return;
    const state = get();
    const conversationId = state.activeConversation?._id;

    // ✅ Optimistic User Message
    const optimisticMessage: ChatMessage = {
      role: "user",
      parts: [{ text: message }]
    };

    // ✅ Show instantly
    set(state => ({
      activeConversation: {
        _id: state.activeConversation?._id,
        title: state.activeConversation?.title || "New Chat",
        createdAt: state.activeConversation?.createdAt || new Date().toISOString(),
        messages: [...(state.activeConversation?.messages || []), optimisticMessage]
      }
    }));

    set({ isSendingMessage: true });

    try {
      const res = await axiosInstance.post("/chat/message", {
        message,
        conversationId
      });

      const aiMessage: ChatMessage = {
        role: "model",
        parts: [{ text: res.data.response }]
      };

      // ✅ Update conversation after server response
      set(state => ({
        activeConversation: {
          ...state.activeConversation!,
          _id: res.data.conversationId,
          messages: [...state.activeConversation!.messages, aiMessage]
        }
      }));

      // ✅ Refresh sidebar
      await get().fetchChatHistory();

    } catch {

      // ❌ Remove if failed
      set(state => ({
        activeConversation: {
          ...state.activeConversation!,
          messages: state.activeConversation!.messages.slice(0, -1)
        }
      }));

      toast.error("Message failed");

    } finally {
      set({ isSendingMessage: false });
    }
  },

  /* ---------------- DELETE CHAT ---------------- */

  deleteChat: async (id: string) => {
    set({ isDeletingChat: true });

    try {
      await axiosInstance.delete(`/chat/${id}`);

      set(state => ({
        conversations: state.conversations.filter(c => c._id !== id),
        activeConversation:
          state.activeConversation?._id === id
            ? {
              title: "New Chat",
              createdAt: new Date().toISOString(),
              messages: []
            }
            : state.activeConversation
      }));

      toast.success("Chat deleted");

    } catch {
      toast.error("Delete failed");
    } finally {
      set({ isDeletingChat: false });
    }
  },

  /* ---------------- RENAME CHAT ---------------- */

  renameChat: async (id: string, title: string) => {
    if (!title.trim()) return;

    set({ isRenamingChat: true });

    try {
      const res = await axiosInstance.patch(`/chat/${id}`, { title });

      set(state => ({
        conversations: state.conversations.map(chat =>
          chat._id === id ? { ...chat, title: res.data.title } : chat
        ),
        activeConversation:
          state.activeConversation?._id === id
            ? { ...state.activeConversation, title: res.data.title }
            : state.activeConversation
      }));

      toast.success("Chat renamed");

    } catch {
      toast.error("Rename failed");
    } finally {
      set({ isRenamingChat: false });
    }
  },

  /* ---------------- HELPERS ---------------- */

  clearActiveChat: () => set({
    activeConversation: {
      title: "New Chat",
      createdAt: new Date().toISOString(),
      messages: []
    }
  }),

  resetChatStore: () => set({
    conversations: [],
    activeConversation: {
      title: "New Chat",
      createdAt: new Date().toISOString(),
      messages: []
    },
    isLoadingChats: false,
    isSendingMessage: false,
    isDeletingChat: false,
    isRenamingChat: false,
    isSearching: false
  })

}));
