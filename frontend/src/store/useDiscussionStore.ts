import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

// Updated to match your JSON structure
export interface Reply {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePic: {
      url: string;
      mediaId: string | null;
    };
  };
  text: string;
  createdAt: string;
}

export interface Discussion {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePic: {
      url: string;
      mediaId: string | null;
    };
  };
  questionTitle: string;
  questionDetails?: string;
  replies: Reply[];
  upvotes: string[]; 
  isResolved: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DiscussionStore {
  discussions: Discussion[];
  selectedDiscussion: Discussion | null;
  isLoading: boolean;
  isActionLoading: boolean;

  fetchDiscussions: (query?: string) => Promise<void>;
  fetchDiscussionById: (id: string) => Promise<void>;
  createQuestion: (data: { questionTitle: string; questionDetails: string }) => Promise<void>;
  addReply: (discussionId: string, text: string) => Promise<void>;
  toggleUpvote: (discussionId: string) => Promise<void>;
  resolveDiscussion: (discussionId: string) => Promise<void>;
}

export const useDiscussionStore = create<DiscussionStore>((set, get) => ({
  discussions: [],
  selectedDiscussion: null,
  isLoading: false,
  isActionLoading: false,

  fetchDiscussions: async (query = "") => {
    set({ isLoading: true });
    try {
      const endpoint = query ? `/discussions/search?q=${query}` : "/discussions";
      const res = await axiosInstance.get(endpoint);
      set({ discussions: res.data });
    } catch (error: any) {
      toast.error("Failed to load discussions");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchDiscussionById: async (id) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/discussions/${id}`);
      set({ selectedDiscussion: res.data });
    } catch (error: any) {
      toast.error("Discussion not found");
      set({ selectedDiscussion: null });
    } finally {
      set({ isLoading: false });
    }
  },

  createQuestion: async (data) => {
    set({ isActionLoading: true });
    try {
      const res = await axiosInstance.post("/discussions", data);
      set((state) => ({ discussions: [res.data, ...state.discussions] }));
      toast.success("Question posted successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to post question");
    } finally {
      set({ isActionLoading: false });
    }
  },

  addReply: async (discussionId, text) => {
    set({ isActionLoading: true });
    try {
      const res = await axiosInstance.post(`/discussions/${discussionId}/reply`, { text });
      
      // Syncing both selected state and the list
      const updatedData = res.data; 
      set((state) => ({
        selectedDiscussion: state.selectedDiscussion?._id === discussionId ? updatedData : state.selectedDiscussion,
        discussions: state.discussions.map((d) => (d._id === discussionId ? updatedData : d)),
      }));

      toast.success("Reply added");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to add reply");
    } finally {
      set({ isActionLoading: false });
    }
  },

  toggleUpvote: async (discussionId) => {
    try {
      const res = await axiosInstance.post(`/discussions/${discussionId}/upvote`);
      // Use the updated discussion object if returned, otherwise update upvotes array
      const updatedDiscussion = res.data;

      set((state) => ({
        selectedDiscussion: state.selectedDiscussion?._id === discussionId ? updatedDiscussion : state.selectedDiscussion,
        discussions: state.discussions.map((d) =>
          d._id === discussionId ? updatedDiscussion : d
        ),
      }));
    } catch (error: any) {
      toast.error("Could not process upvote");
    }
  },

  resolveDiscussion: async (discussionId) => {
    set({ isActionLoading: true });
    try {
      const res = await axiosInstance.patch(`/discussions/${discussionId}/resolve`);
      // Assuming res.data.discussion matches the JSON structure you provided
      const updatedDiscussion = res.data.discussion;

      set((state) => ({
        selectedDiscussion: state.selectedDiscussion?._id === discussionId ? updatedDiscussion : state.selectedDiscussion,
        discussions: state.discussions.map((d) => 
            d._id === discussionId ? updatedDiscussion : d
        ),
      }));

      toast.success("Marked as resolved");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to resolve");
    } finally {
      set({ isActionLoading: false });
    }
  },
}));