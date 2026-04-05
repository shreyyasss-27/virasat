import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
import type { ReactNode } from "react";

export interface Product {
  reviews: any;
  seller: any;
  totalRatings: ReactNode;
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  tags?: string[];
  image: { mediaId: string | null, url: string, altText: string };
  averageRating?: number;
  isApproved?: boolean;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductStore {
  products: Product[];
  product: Product | null;
  count: number;
  page: number;
  pages: number;
  isLoading: boolean;
  isSaving: boolean;

  fetchProducts: (params?: { keyword?: string; category?: string; page?: number }) => Promise<void>;
  fetchProductBySeller: () => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  createProduct: (data: any) => Promise<void>;
  updateProduct: (id: string, data: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  product: null,
  count: 0,
  page: 1,
  pages: 1,
  isLoading: false,
  isSaving: false,

  fetchProducts: async ({ keyword = "", category = "", page = 1 } = {}) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(
        `/products?keyword=${keyword}&category=${category}&pageNumber=${page}`
      );
      set({
        products: res.data.products,
        count: res.data.count,
        page: res.data.page,
        pages: res.data.pages,
      });
      console.log(res.data)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch products");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProductBySeller: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/products/seller`);
      const productData = res.data.products ? res.data.products : res.data;
    
    set({ products: Array.isArray(productData) ? productData : [] });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch product details");
      set({ products: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProductById: async (id) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/products/${id}`);
      set({ product: res.data });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch product details");
      set({ product: null });
    } finally {
      set({ isLoading: false });
    }
  },

  createProduct: async (data) => {
    set({ isSaving: true });
    try {
      const res = await axiosInstance.post("/products", data);
      toast.success("Product created successfully");
      await useProductStore.getState().fetchProducts();
      return res.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create product");
    } finally {
      set({ isSaving: false });
    }
  },

  updateProduct: async (id, data) => {
    set({ isSaving: true });
    try {
      const res = await axiosInstance.put(`/products/${id}`, data);
      toast.success("Product updated successfully");
      await useProductStore.getState().fetchProducts();
      return res.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      set({ isSaving: false });
    }
  },

  deleteProduct: async (id) => {
    set({ isSaving: true });
    try {
      await axiosInstance.delete(`/products/${id}`);
      toast.success("Product deleted successfully");
      await useProductStore.getState().fetchProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    } finally {
      set({ isSaving: false });
    }
  },
}));
