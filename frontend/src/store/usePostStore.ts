import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

export interface Reaction {
  type: string;
  userId: string;
  emoji: string;
}

export interface Post {
  _id: string;
  headId: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  communityId: {
    _id: string;
    name: string;
    niche?: string;
  };
  title: string;
  description: any;
  media: {
    url?: string;
    fileType: 'image' | 'video' | 'pdf' | 'none';
    fileName?: string;
    mediaId?: string; // Added to track for cleanup
  };
  reactions: Reaction[];
  isPublic: boolean;
  createdAt: string;
}

interface PostStore {
  posts: Post[];
  selectedPost: Post | null;
  isLoading: boolean;
  isActionLoading: boolean;

  fetchPublicPosts: (titleQuery?: string) => Promise<void>;
  fetchPostsByCommunity: (communityId: string) => Promise<void>;
  fetchPostById: (id: string) => Promise<void>;
  createPost: (data: Partial<Post>) => Promise<void>;
  updatePost: (id: string, data: Partial<Post>) => Promise<void>; // Added
  giveReaction: (postId: string, emoji: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
}

export const usePostStore = create<PostStore>((set, get) => ({
  posts: [],
  selectedPost: null,
  isLoading: false,
  isActionLoading: false,

  fetchPublicPosts: async (titleQuery = "") => {
    set({ isLoading: true });
    try {
      const endpoint = titleQuery
        ? `/posts/search?title=${titleQuery}`
        : "/posts"; // Matches our updated route for getAllPosts
      const res = await axiosInstance.get(endpoint);
      set({ posts: res.data });
    } catch (error: any) {
      toast.error("Failed to fetch posts");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPostsByCommunity: async (communityId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/posts/community/${communityId}`);
      set({ posts: res.data });
    } catch (error: any) {
      toast.error("Failed to load community posts");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPostById: async (id) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/posts/${id}`);
      set({ selectedPost: res.data });
    } catch (error: any) {
      set({ selectedPost: null });
      toast.error("Post not found");
    } finally {
      set({ isLoading: false });
    }
  },

  createPost: async (postData) => {
    set({ isActionLoading: true });
    try {
      const res = await axiosInstance.post("/posts", postData);
      set((state) => ({ posts: [res.data, ...state.posts] }));
      toast.success("Post broadcasted successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      set({ isActionLoading: false });
    }
  },

  updatePost: async (id, postData) => {
    set({ isActionLoading: true });
    try {
      const res = await axiosInstance.put(`/posts/${id}`, postData);
      set((state) => ({
        posts: state.posts.map((p) => (p._id === id ? res.data : p)),
        selectedPost: state.selectedPost?._id === id ? res.data : state.selectedPost,
      }));
      toast.success("Post updated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update post");
    } finally {
      set({ isActionLoading: false });
    }
  },

  // Inside usePostStore.ts -> giveReaction function
  giveReaction: async (postId, emoji) => {
    try {
      // payload matches your expected backend: { postId, emoji }
      const res = await axiosInstance.post(`/posts/react`, { postId, emoji });

      // We expect res.data to be the updated reactions array for that post
      const updatedReactions = res.data;

      set((state) => ({
        posts: state.posts.map((p) =>
          p._id === postId ? { ...p, reactions: updatedReactions } : p
        ),
        selectedPost: state.selectedPost?._id === postId
          ? { ...state.selectedPost, reactions: updatedReactions }
          : state.selectedPost
      }));
    } catch (error: any) {
      console.error("Reaction Error:", error);
      toast.error("Failed to react to post");
    }
  },

  deletePost: async (postId) => {
    set({ isActionLoading: true });
    try {
      await axiosInstance.delete(`/posts/${postId}`);
      set((state) => ({
        posts: state.posts.filter((p) => p._id !== postId),
        selectedPost: state.selectedPost?._id === postId ? null : state.selectedPost,
      }));
      toast.success("Post deleted successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete post");
    } finally {
      set({ isActionLoading: false });
    }
  },
}));