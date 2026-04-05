import { create } from "zustand";
import { axiosInstance } from "../lib/axios.ts";
import { toast } from "sonner";
import { type AuthUser } from "./useAuthStore.ts";

export interface UserProfileResponse {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  profilePic: {
    mediaId: string | null;
    url: string;
  };
  roles: string[]; // Standardized to roles
  iSOnboarded: boolean;
  phoneNumber?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  bankDetails?: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  // New Expert Specific Fields
  expertDetails?: {
    fieldOfExpertise: string;
    institution?: string;
    verified: boolean;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AllUsersResponse {
  success: true;
  count: number;
  users: Omit<AuthUser, "password">[];
}

export type UserUpdatePayload = Partial<UserProfileResponse> & {
  password?: string;
};

interface UserState {
  userProfile: UserProfileResponse | null;
  allUsers: Omit<AuthUser, "password">[] | null;
  isFetchingProfile: boolean;
  isUpdatingProfile: boolean;
  isDeletingUser: boolean;
  isFetchingAllUsers: boolean;

  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (data: UserUpdatePayload) => Promise<boolean>; // Changed to return boolean for the form onClose logic
  deleteUserAccount: () => Promise<void>;
  fetchAllUsers: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  userProfile: null,
  allUsers: null,
  isFetchingProfile: false,
  isUpdatingProfile: false,
  isDeletingUser: false,
  isFetchingAllUsers: false,

  fetchUserProfile: async () => {
    set({ isFetchingProfile: true });
    try {
      const res = await axiosInstance.get("/users/profile");
      set({ userProfile: res.data as UserProfileResponse });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch user profile.");
      set({ userProfile: null });
    } finally {
      set({ isFetchingProfile: false });
    }
  },

  updateUserProfile: async (data: UserUpdatePayload) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/users/profile", data);
      
      // Assuming your backend returns { success: true, user: {...}, message: "..." }
      const updatedUser = res.data.user as UserProfileResponse;
      set({ userProfile: updatedUser });
      
      toast.success(res.data.message || "Profile updated successfully!");
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update profile.";
      toast.error(errorMessage);
      console.error("Update Profile Error:", error);
      return false;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  deleteUserAccount: async () => {
    set({ isDeletingUser: true });
    try {
      const res = await axiosInstance.delete("/users");
      set({ userProfile: null });
      toast.success(res.data.message || "Account deleted successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete account.");
    } finally {
      set({ isDeletingUser: false });
    }
  },

  fetchAllUsers: async () => {
    set({ isFetchingAllUsers: true });
    try {
      const res = await axiosInstance.get("/users");
      const data = res.data as AllUsersResponse;
      set({ allUsers: data.users });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch users list.");
      set({ allUsers: null });
    } finally {
      set({ isFetchingAllUsers: false });
    }
  },
}));