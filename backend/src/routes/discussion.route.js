import express from "express";
import { 
  createQuestion, 
  addReply, 
  toggleUpvote, 
  resolveDiscussion, 
  getAllDiscussions, 
  getDiscussionsByQuery, 
  getDiscussionById 
} from "../controllers/discussion.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js"; // Adjust the path to your auth middleware

const router = express.Router();

// --- Public Routes ---
// Get all discussions (with optional sorting/population)
router.get("/", getAllDiscussions);

// Search discussions by query: /api/discussions/search?q=Spartans
router.get("/search", getDiscussionsByQuery);

// Get specific discussion details
router.get("/:id", getDiscussionById);

// --- Protected Routes (Require Authentication) ---

// Create a new discussion question
router.post("/", protectRoute, createQuestion);

// Add a reply to a discussion
router.post("/:discussionId/reply", protectRoute, addReply);

// Toggle upvote on a discussion
router.post("/:discussionId/upvote", protectRoute, toggleUpvote);

// Mark a discussion as resolved (Security check is handled inside the controller)
router.patch("/:discussionId/resolve", protectRoute, resolveDiscussion);

export default router;