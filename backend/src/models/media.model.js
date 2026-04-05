import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    module: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Media", mediaSchema);
