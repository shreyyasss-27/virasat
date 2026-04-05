import Conversation from "../models/conversation.model.js";
import axios from "axios";

const RAG_API_URL = process.env.RAG_API_URL || "http://localhost:8000";
const HISTORY_LIMIT = 20;

/* ---------------- CHAT MESSAGE ---------------- */
export async function sendMessage(req, res) {
  const { message, conversationId } = req.body;
  const userId = req.user._id;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message content is required." });
  }

  try {
    let conversation = null;

    /* ---------------- LOAD CHAT ---------------- */
    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        userId,
      });

      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found." });
      }
    }

    /* ---------------- RAG PIPELINE CALL ---------------- */
    const ragResponse = await axios.post(`${RAG_API_URL}/query`, {
      query: message,
      language: "auto",
      session_id: conversationId || null,
      user_id: userId.toString(),
      return_history: false
    });

    const aiMessageText = ragResponse.data.response || "No response from AI";

    const newUserMessage = {
      role: "user",
      parts: [{ text: message }],
    };

    const newAiMessage = {
      role: "model",
      parts: [{ text: aiMessageText }],
    };

    /* ---------------- EXISTING CHAT ---------------- */
    if (conversation) {
      conversation.messages.push(newUserMessage, newAiMessage);
      await conversation.save();

      return res.status(200).json({
        response: aiMessageText,
        conversationId: conversation._id,
      });
    }

    /* ---------------- NEW CHAT ---------------- */
    const title =
      message.substring(0, 25) + "...";

    conversation = await Conversation.create({
      userId,
      title,
      messages: [newUserMessage, newAiMessage],
    });

    return res.status(201).json({
      response: aiMessageText,
      conversationId: conversation._id,
    });

  } catch (error) {
    console.error("RAG Pipeline Error:", error?.message || error);
    res.status(500).json({
      error: "AI service temporarily unavailable. Please retry."
    });
  }
}

/* ---------------- CHAT LIST + SEARCH ---------------- */
// export async function getChatHistory(req, res) {
//   const { q } = req.query;
//   const userId = req.user._id;

//   try {
//     const query = {
//       userId,
//       ...(q && { $text: { $search: q } })
//     };

//     const history = await Conversation.find(query)
//       .select("_id title createdAt")
//       .sort({ createdAt: -1 });

//     res.status(200).json(history);

//   } catch (error) {
//     console.error("History Error:", error);
//     res.status(500).json({ error: "Unable to fetch chat history." });
//   }
// }
// src/controllers/chat.controller.js

/* ---------------- CHAT LIST + SEARCH ---------------- */
export async function getChatHistory(req, res) {
  const { q } = req.query;
  const userId = req.user._id;

  try {
    const query = {
      userId,
      // ✅ Using $regex for case-insensitive substring search on 'title'
      ...(q && { 
          title: { 
              $regex: q, 
              $options: 'i' // 'i' flag makes the search case-insensitive
          } 
      })
    };

    const history = await Conversation.find(query)
      .select("_id title createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json(history);

  } catch (error) {
    console.error("History Error:", error);
    res.status(500).json({ error: "Unable to fetch chat history." });
  }
}
/* ---------------- LOAD SINGLE CHAT ---------------- */
export async function getConversationById(req, res) {
  try {
    const chat = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({ error: "Conversation not found." });
    }

    res.status(200).json(chat);

  } catch (error) {
    console.error("Conversation Error:", error);
    res.status(500).json({ error: "Unable to load conversation." });
  }
}

/* ---------------- HARD DELETE ---------------- */
export async function deleteChat(req, res) {
  try {
    const result = await Conversation.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!result) {
      return res.status(404).json({ error: "Conversation not found." });
    }

    res.status(200).json({ message: "Chat deleted permanently." });

  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "Failed to delete chat." });
  }
}

/* ---------------- RENAME CHAT ---------------- */
export async function renameChat(req, res) {
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required." });
  }

  try {
    const chat = await Conversation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ error: "Chat not found." });
    }

    res.status(200).json({
      message: "Chat renamed successfully.",
      title: chat.title,
    });

  } catch (error) {
    console.error("Rename Error:", error);
    res.status(500).json({ error: "Rename failed." });
  }
}
