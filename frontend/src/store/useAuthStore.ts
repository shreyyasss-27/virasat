import { create } from "zustand";
import { axiosInstance } from "../lib/axios.ts";
import { toast } from "sonner";

export interface AuthUser {
  bio: string;
  createdAt: string;
  email: string;
  firstName: string;
  iSOnboarded: boolean;
  lastName: string;
  location: string;
  profilePic: {
    url: string;
    mediaId: string | null;
  };
  roles: string[];
  status: "PENDING_APPROVAL" | string;
  updatedAt: string;
  _id: string;
  phoneNumber?: string;
  address?: any;
}

export interface AuthResponse {
  success?: boolean;
  user: AuthUser;
}

interface AuthStore {
  setAuthUserFromResponse(data: any): unknown;
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;

  checkAuth: () => Promise<void>;
  signup: (data: any) => Promise<void>;
  login: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  setAuthUserFromResponse: (data: any) => {
    let user: AuthUser | null = null;
    if (data && data.user) {
      user = data.user as AuthUser;
    } else if (data && data._id && data.email) {
      user = data as AuthUser;
    }
    set({ authUser: user });
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/me");
      useAuthStore.getState().setAuthUserFromResponse(res.data);
    } catch {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: any) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      useAuthStore.getState().setAuthUserFromResponse(res.data);
      toast.success("Account created successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed.");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data: any) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      useAuthStore.getState().setAuthUserFromResponse(res.data);
      toast.success("Logged in successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed.");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Logout failed.");
    }
  },

  updateProfile: async (data: any) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      useAuthStore.getState().setAuthUserFromResponse(res.data);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Profile update failed.");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
