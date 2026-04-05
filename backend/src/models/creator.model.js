import mongoose from "mongoose";

const creatorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    totalSubscribers: {
      type: Number,
      default: 0,
    },

    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video", 
      },
    ],

    verified: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Creator = mongoose.model("Creator", creatorSchema);

export default Creator;
