import express from "express";
import { 
  createCommunity, 
  getCommunities, 
  getCommunityById, 
  searchCommunities, 
  toggleMembership,
  getMyCommunities
} from "../controllers/community.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// --- 1. Static/Search Routes (Must come first) ---

// Search must stay above /:id
router.get("/search", protectRoute, searchCommunities); 

// "My Communities" MUST stay above /:id to avoid being treated as an ID
router.get("/my", protectRoute, getMyCommunities);


// --- 2. General Discovery ---

// Get all communities (Discovery tab)
router.get("/", protectRoute, getCommunities);


// --- 3. Parameterized Routes (Must come last) ---

// Dynamic ID route
router.get("/:id", protectRoute, getCommunityById);


// --- 4. Action Routes (POST) ---

// Automated creation
router.post("/create", protectRoute, createCommunity);

// Join/Leave toggle
router.post("/toggle/:id", protectRoute, toggleMembership);

export default router;