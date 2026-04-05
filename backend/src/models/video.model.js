import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    videoData: {
      mediaId: { type: mongoose.Schema.Types.ObjectId, ref: "Media" },
      url: { type: String, required: true },
    },

    thumbnail: {
      mediaId: { type: mongoose.Schema.Types.ObjectId, ref: "Media" },
      url: { type: String, required: true },
    },

    category: {
      type: String,
      required: true,
    },

    duration: {
      type: Number, // in seconds
      required: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    views: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],

    likes: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],

    isApproved: {
      type: Boolean,
      default: true,
    },

    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Video = mongoose.model("Video", videoSchema);

export default Video;
