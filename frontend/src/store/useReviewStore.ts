import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

export interface Review {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePic?: string;
  };
  product: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface ReviewStore {
  reviews: Review[];
  isLoading: boolean;
  isSubmitting: boolean;

  fetchProductReviews: (productId: string) => Promise<void>;
  addOrUpdateReview: (productId: string, data: { rating: number; comment: string }) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
}

export const useReviewStore = create<ReviewStore>((set, get) => ({
  reviews: [],
  isLoading: false,
  isSubmitting: false,

  // Fetch all reviews for a specific product
  fetchProductReviews: async (productId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/reviews/${productId}`);
      set({ reviews: res.data.reviews || [] });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load reviews");
      set({ reviews: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  // Add or update review
  addOrUpdateReview: async (productId, data) => {
    set({ isSubmitting: true });
    try {
      const res = await axiosInstance.post(`/reviews/${productId}`, data);
      toast.success(res.data.message || "Review submitted");

      // Optimistic update: refresh reviews
      await get().fetchProductReviews(productId);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      set({ isSubmitting: false });
    }
  },

  // Delete review
  deleteReview: async (reviewId) => {
    set({ isSubmitting: true });
    try {
      const res = await axiosInstance.delete(`/reviews/${reviewId}`);
      toast.success(res.data.message || "Review deleted");

      // Update local store by removing the deleted review
      set({
        reviews: get().reviews.filter((r) => r._id !== reviewId),
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete review");
    } finally {
      set({ isSubmitting: false });
    }
  },
}));
