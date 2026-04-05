import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

export interface Order {
  totalPrice: any;
  orderItems: any;
  _id: string;
  user: string;
  items: any[];
  shippingAddress: any;
  totalAmount: number;
  paymentMethod?: string;
  orderStatus: string;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
  // Razorpay specific fields
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}

interface OrderStore {
  orders: Order[];
  order: Order | null;
  isLoading: boolean;
  isCreating: boolean;

  createOrder: (data: any) => Promise<void>;
  fetchMyOrders: () => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  fetchAllOrders: () => Promise<void>;
  markAsDelivered: (id: string) => Promise<void>;
  markAsPaid: (id: string, paymentData: any) => Promise<void>;
  createRazorpayOrder: (amount: number) => Promise<any>;
  verifyRazorpayPayment: (paymentData: any) => Promise<any>;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  order: null,
  isLoading: false,
  isCreating: false,

  createOrder: async (data) => {
    set({ isCreating: true });
    try {
      const res = await axiosInstance.post("/orders", data);
      toast.success("Order placed successfully!");
      set({ order: res.data });
      return res.data;
    } catch (error: any) {
      console.error("Order creation failed:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to place order");
      return null;
    } finally {
      set({ isCreating: false });
    }
  },

  fetchMyOrders: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/orders/myorders");
      console.log(res.data)
      set({ orders: res.data });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch your orders");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchOrderById: async (id) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/orders/${id}`);
      set({ order: res.data });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch order details");
      set({ order: null });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAllOrders: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/orders");
      set({ orders: res.data });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch all orders");
    } finally {
      set({ isLoading: false });
    }
  },

  markAsDelivered: async (id) => {
    try {
      const res = await axiosInstance.put(`/orders/${id}/deliver`);
      toast.success("Order marked as delivered");
      set({ order: res.data });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update delivery status");
    }
  },
  markAsPaid: async (id: string, paymentData: any) => {
    try {
      const res = await axiosInstance.put(`/orders/${id}/pay`, paymentData);
      toast.success("Order marked as paid");
      set({ order: res.data });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update payment");
    }
  },
  createRazorpayOrder: async (amount: number) => {
    try {
      const res = await axiosInstance.post("/orders/razorpay/create-order", { amount });
      return res.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create payment order");
      throw error;
    }
  },
  verifyRazorpayPayment: async (paymentData: any) => {
    try {
      const res = await axiosInstance.post("/orders/razorpay/verify-payment", paymentData);
      toast.success("Payment verified successfully!");
      return res.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to verify payment");
      throw error;
    }
  }
}));
