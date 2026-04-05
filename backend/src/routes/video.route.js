import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  getVideos,
  getVideosByCreator,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  addComment,
  toggleLikeVideo
} from "../controllers/video.controller.js";

const router = express.Router();

// 1. Static Routes (Specific paths first)
router.get("/", getVideos);
router.get("/my-videos", protectRoute, getVideosByCreator); // MOVED UP

// 2. Dynamic Routes (ID-based paths last)
router.get("/:id", protectRoute, getVideoById); // MOVED DOWN

// 3. Protected Mutation Routes
router.post("/", protectRoute, createVideo);
router.put("/:id", protectRoute, updateVideo);
router.delete("/:id", protectRoute, deleteVideo);

// 4. Interaction routes
router.post("/:id/comments", protectRoute, addComment);
router.patch("/:id/like", protectRoute, toggleLikeVideo);

export default router;