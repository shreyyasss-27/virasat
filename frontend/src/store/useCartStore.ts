import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
import type { Product } from "./useProductStore.ts";

export interface CartItem {
  product: Product;
  quantity: number;
  _id?: string;
}

export interface Cart {
  _id?: string;
  user: string;
  items: CartItem[];
  subTotal: number;
}

interface CartStore {
  cart: Cart | null;
  isLoading: boolean;
  isUpdating: boolean;

  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartStore>((set) => ({
  cart: null,
  isLoading: false,
  isUpdating: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/cart");
      set({ cart: res.data.cart });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch cart");
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    set({ isUpdating: true });
    try {
      const res = await axiosInstance.post("/cart/add", { productId, quantity });
      set({ cart: res.data.cart });
      toast.success(res.data.message || "Cart updated");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update cart");
    } finally {
      set({ isUpdating: false });
    }
  },

  removeFromCart: async (productId) => {
    set({ isUpdating: true });
    try {
      const res = await axiosInstance.delete(`/cart/remove/${productId}`);
      set({ cart: res.data.cart });
      toast.success(res.data.message || "Item removed");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to remove item");
    } finally {
      set({ isUpdating: false });
    }
  },

  clearCart: async () => {
    set({ isUpdating: true });
    try {
      const res = await axiosInstance.put("/cart/clear");
      console.log(res.data)
      set({ cart: res.data.cart });
      toast.success(res.data.message || "Cart cleared");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to clear cart");
    } finally {
      set({ isUpdating: false });
    }
  },
}));
