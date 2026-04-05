import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  sendMessage,
  getChatHistory,
  getConversationById,
  deleteChat,
  renameChat
} from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/message", protectRoute, sendMessage);
router.get("/history", protectRoute, getChatHistory);
router.get("/:id", protectRoute, getConversationById);
router.delete("/:id", protectRoute, deleteChat);
router.patch("/:id", protectRoute, renameChat);

export default router;
