import mongoose from "mongoose"

const SellerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    verified: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Seller = mongoose.model("Seller", SellerSchema)

export default Seller