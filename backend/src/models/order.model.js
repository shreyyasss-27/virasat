import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true }, 
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true }, 
      },
    ],

    shippingAddress: {
      street: String,
      city: String,
      state: String,
      pinCode: String,
      country: String,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    orderStatus: {
      type: String,
      enum: ["PAID", "PENDING", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },

    paymentMethod: { type: String },

    paymentResult: {
      id: String,
      status: String,
      update_time: String,
    },

    // Razorpay specific fields
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: Date,

    isDelivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: Date,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
