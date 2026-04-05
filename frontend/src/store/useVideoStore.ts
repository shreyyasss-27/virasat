import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
import { useAuthStore } from "./useAuthStore";

export interface Comment {
  user: any;
  comment: string;
  createdAt: string;
  _id: string;
}

// Updated to match your Mongoose Schema nested objects
export interface Video {
  _id: string;
  creator: any;
  title: string;
  description: string;
  videoData: {
    mediaId?: string;
    url: string;
    altText?: string;
  };
  thumbnail: {
    mediaId?: string;
    url: string;
    altText?: string;
  };
  category: string;
  duration: number;
  tags: string[];
  views: String[];
  likes: string[]; // Changed from number to string[] to track User IDs
  isApproved: boolean;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

interface VideoStore {
  videos: Video[];
  video: Video | null;
  count: number;
  page: number;
  pages: number;
  isLoading: boolean;
  isSaving: boolean;

  fetchVideos: (params?: { keyword?: string; category?: string; page?: number }) => Promise<void>;
  fetchVideosByCreator: () => Promise<void>;
  fetchVideoById: (id: string) => Promise<void>;
  createVideo: (data: any) => Promise<any>;
  updateVideo: (id: string, data: any) => Promise<any>;
  deleteVideo: (id: string) => Promise<void>;
  addComment: (videoId: string, comment: string) => Promise<void>;
  toggleLike: (videoId: string) => Promise<void>; // Added toggleLike
}

export const useVideoStore = create<VideoStore>((set, get) => ({
  videos: [],
  video: null,
  count: 0,
  page: 1,
  pages: 1,
  isLoading: false,
  isSaving: false,

  fetchVideos: async ({ keyword = "", category = "", page = 1 } = {}) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(
        `/videos?keyword=${keyword}&category=${category}&pageNumber=${page}`
      );
      set({
        videos: res.data.videos,
        count: res.data.count,
        page: res.data.page,
        pages: res.data.pages,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch videos");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchVideosByCreator: async () => {
    set({ isLoading: true });
    try {
      // Adjusted route to match standard controller patterns (e.g., /api/videos/my-videos)
      const res = await axiosInstance.get(`/videos/my-videos`);
      set({ videos: Array.isArray(res.data) ? res.data : [] });
    } catch (error: any) {
      console.error(error);
      set({ videos: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchVideoById: async (id) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/videos/${id}`);
      set({ video: res.data });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch video details");
      set({ video: null });
    } finally {
      set({ isLoading: false });
    }
  },

  createVideo: async (data) => {
    set({ isSaving: true });
    try {
      // Data should include: title, description, videoUrl, mediaId, thumbnailUrl, thumbnailMediaId, etc.
      const res = await axiosInstance.post("/videos", data);
      toast.success("Video uploaded successfully");
      return res.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload video");
      throw error;
    } finally {
      set({ isSaving: false });
    }
  },

  updateVideo: async (id, data) => {
    set({ isSaving: true });
    try {
      const res = await axiosInstance.put(`/videos/${id}`, data);
      toast.success("Video updated successfully");
      
      // Update local state for the specific video if it's currently being viewed
      if (get().video?._id === id) {
        set({ video: res.data.video });
      }
      
      return res.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update video");
      throw error;
    } finally {
      set({ isSaving: false });
    }
  },

  deleteVideo: async (id) => {
    set({ isSaving: true });
    try {
      await axiosInstance.delete(`/videos/${id}`);
      set((state) => ({
        videos: state.videos.filter((v) => v._id !== id),
      }));
      toast.success("Video deleted successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete video");
    } finally {
      set({ isSaving: false });
    }
  },

  addComment: async (videoId, comment) => {
    try {
      await axiosInstance.post(`/videos/${videoId}/comments`, { comment });
      toast.success("Comment added");
      await get().fetchVideoById(videoId); 
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add comment");
    }
  },

  toggleLike: async (videoId: string) => {
  try {
    const res = await axiosInstance.patch(`/videos/${videoId}/like`);
    const { isLiked } = res.data; // Backend should return if it's currently liked
    console.log(isLiked)

    set((state) => {
      if (!state.video) return state;

      const userId = useAuthStore.getState().authUser?._id;
      if (!userId) return state;

      // Update the likes array locally for immediate feedback
      const updatedLikes = isLiked 
        ? [...state.video.likes, userId] 
        : state.video.likes.filter(id => id.toString() !== userId.toString());

      return {
        video: { ...state.video, likes: updatedLikes }
      };
    });
  } catch (error) {
    toast.error("Failed to update like status");
  }
}
}));