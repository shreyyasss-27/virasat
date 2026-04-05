import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // product.model.js
    image: {
      mediaId: { type: mongoose.Schema.Types.ObjectId, ref: "Media" },
      url: { type: String, required: true },
      altText: { type: String, default: "Virasat Product Image" }
    },

    category: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      required: true,
      default: 1,
    },

    tags: {
      type: [String],
      default: [],
    },

    isApproved: {
      type: Boolean,
      default: true, 
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    totalRatings: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true
    },

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
