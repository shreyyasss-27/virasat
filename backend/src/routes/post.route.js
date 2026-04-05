import express from "express";
import { 
  createPost, 
  updatePost,
  getPublicPosts, 
  getAllPosts, 
  getPostsByCommunity, 
  getPostsByTitle, 
  giveReaction, 
  getPostById, 
  deletePostById 
} from "../controllers/post.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js"; 

const router = express.Router();

// --- Public / General Routes ---
router.get("/", getAllPosts);                   // Get all populated public posts
router.get("/public", getPublicPosts);          // Simple public list
router.get("/search", getPostsByTitle);         // Search by ?title=...
router.get("/community/:communityId", getPostsByCommunity);
router.get("/:id", getPostById);                // Specific post detail

// --- Protected Routes (Require Authentication) ---
router.post("/", protectRoute, createPost);          // Create a new post
router.put("/:id", protectRoute, updatePost);        // Update existing post
router.delete("/:id", protectRoute, deletePostById); // Delete post
router.post("/react", protectRoute, giveReaction);   // Toggle reactions

export default router;