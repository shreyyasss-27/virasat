import Discussion from "../models/discussion.model.js";

export const createQuestion = async (req, res) => {
  try {
    const { questionTitle, questionDetails } = req.body;
    
    const newQuestion = await Discussion.create({
      userId: req.user._id,
      questionTitle,
      questionDetails
    });

    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addReply = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { text } = req.body;

    const discussion = await Discussion.findByIdAndUpdate(
      discussionId,
      { 
        $push: { replies: { userId: req.user._id, text } } 
      },
      { new: true }
    );

    res.status(200).json(discussion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const toggleUpvote = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const userId = req.user._id;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) return res.status(404).json({ message: "Discussion not found" });

    // Check if user already upvoted
    const hasUpvoted = discussion.upvotes.includes(userId);

    const update = hasUpvoted 
      ? { $pull: { upvotes: userId } } // Remove upvote
      : { $addToSet: { upvotes: userId } }; // Add upvote (unique)

    const updatedDiscussion = await Discussion.findByIdAndUpdate(
      discussionId,
      update,
      { new: true }
    );

    res.status(200).json({ 
      upvotesCount: updatedDiscussion.upvotes.length, 
      hasUpvoted: !hasUpvoted 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resolveDiscussion = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const userId = req.user._id;

    const discussion = await Discussion.findById(discussionId);

    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    // SECURITY: Ensure only the original asker can resolve it
    if (discussion.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only the author can resolve this question." });
    }

    discussion.isResolved = true;
    await discussion.save();

    res.status(200).json({ message: "Discussion marked as resolved", discussion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllDiscussions = async (req, res) => {
  try {
    // Fetches questions across the whole platform
    const discussions = await Discussion.find()
      .populate("userId", "username profileImage") // Who asked
      .sort({ createdAt: -1 });

    res.status(200).json(discussions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getDiscussionsByQuery = async (req, res) => {
  try {
    const { q } = req.query; // e.g., /api/discussions/search?q=Spartans
    
    const discussions = await Discussion.find({
      questionTitle: { $regex: q, $options: "i" }
    }).populate("userId", "username");

    res.status(200).json(discussions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getDiscussionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const discussion = await Discussion.findById(id)
      .populate("userId", "firstName lastName profilePic") // Updated field names
      .populate("replies.userId", "firstName lastName profilePic"); // Updated field names

    if (!discussion) return res.status(404).json({ message: "Discussion not found" });

    res.status(200).json(discussion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};