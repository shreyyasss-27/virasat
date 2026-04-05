import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

export interface Community {
  members: any;
  description: string;
  _id: string;
  name: string;
  bio?: string;
  niche: string;
  profilePic?: { url: string };
  memberCount: number;
  headId: any;
  isMember?: boolean;
  createdAt: string;
}

interface CommunityStore {
  communities: Community[];
  myCommunities: Community[];
  searchResults: Community[];
  selectedCommunity: Community | null;
  isLoading: boolean;
  isActionLoading: boolean;
  fetchCommunities: () => Promise<void>;
  fetchMyCommunities: () => Promise<void>;
  fetchCommunityById: (id: string) => Promise<void>;
  searchCommunities: (query: string) => Promise<void>;
  toggleMembership: (id: string) => Promise<void>;
}

export const useCommunityStore = create<CommunityStore>((set, get) => ({
  communities: [],
  myCommunities: [],
  searchResults: [],
  selectedCommunity: null,
  isLoading: false,
  isActionLoading: false,

  fetchCommunities: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/communities");
      set({ communities: res.data });
    } catch (error: any) {
      toast.error("Failed to load communities");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMyCommunities: async () => {
    try {
      const res = await axiosInstance.get("/communities/my");
      set({ myCommunities: res.data });
    } catch (error: any) {
      console.error("Error fetching joined communities", error);
    }
  },

  fetchCommunityById: async (id) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/communities/${id}`);
      set({ selectedCommunity: res.data });
    } catch (error: any) {
      set({ selectedCommunity: null });
    } finally {
      set({ isLoading: false });
    }
  },

  searchCommunities: async (query: string) => {
    if (!query.trim()) {
      set({ searchResults: [] });
      return;
    }
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/communities/search?query=${query}`);
      set({ searchResults: res.data });
    } catch (error: any) {
      console.error("Search failed", error);
    } finally {
      set({ isLoading: false });
    }
  },

  toggleMembership: async (id) => {
    set({ isActionLoading: true });
    try {
      const res = await axiosInstance.post(`/communities/toggle/${id}`);
      const isJoined = res.data.joined; // Coming from our updated controller

      // 1. Update the main list and search results locally
      const updateList = (list: Community[]) =>
        list.map((comm) =>
          comm._id === id
            ? {
                ...comm,
                isMember: isJoined,
                memberCount: isJoined ? comm.memberCount + 1 : comm.memberCount - 1,
              }
            : comm
        );

      set((state) => ({
        communities: updateList(state.communities),
        searchResults: updateList(state.searchResults),
        // If we're looking at the detail page, update that too
        selectedCommunity: state.selectedCommunity?._id === id 
          ? { ...state.selectedCommunity, isMember: isJoined, memberCount: isJoined ? state.selectedCommunity.memberCount + 1 : state.selectedCommunity.memberCount - 1 }
          : state.selectedCommunity
      }));

      // 2. Silently refresh "My Communities" in the background
      get().fetchMyCommunities();

      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      set({ isActionLoading: false });
    }
  },
}));