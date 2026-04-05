import Post from "../models/post.model.js";
import Community from "../models/community.model.js";
import Expert from "../models/expert.model.js";
import { cleanupMedia } from "./media.controller.js";

// 1. CREATE POST (Automatically finds community by headId/userId)
export const createPost = async (req, res) => {
  try {
    const { title, description, media, isPublic } = req.body;
    const userId = req.user._id;

    // FIND community where the current user is the Head
    const community = await Community.findOne({ headId: userId });

    if (!community) {
      return res.status(404).json({ 
        message: "Expert community not found. Please ensure your expert profile is active." 
      });
    }

    const newPost = await Post.create({
      headId: userId,
      communityId: community._id, // Set the community ID automatically
      title,
      description,
      media,
      isPublic: isPublic ?? true
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Create Post Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// 2. UPDATE POST
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, media, isPublic } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.headId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this post" });
    }

    // Media cleanup logic
    if (media?.mediaId && post.media?.mediaId && media.mediaId !== post.media.mediaId) {
      await cleanupMedia(post.media.mediaId);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, description, media, isPublic },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. GET PUBLIC POSTS
export const getPublicPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isPublic: true }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. GET ALL POSTS (Populated & Enriched)
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isPublic: true })
      .populate("headId", "firstName lastName profilePic")
      .populate("communityId")
      .sort({ createdAt: -1 });

    const enriched = await Promise.all(posts.map(async (p) => {
      const expert = await Expert.findOne({ userId: p.headId._id }).select("fieldOfExpertise");
      return {
        ...p._doc,
        headId: {
          _id: p.headId._id,
          name: `${p.headId.firstName} ${p.headId.lastName}`,
          profileImage: p.headId.profilePic?.url
        },
        communityId: {
          _id: p.communityId._id,
          name: `${p.headId.firstName} ${p.headId.lastName}`,
          niche: expert?.fieldOfExpertise || "Expert"
        }
      };
    }));

    res.status(200).json(enriched);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. GET POSTS BY COMMUNITY
export const getPostsByCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;
    const posts = await Post.find({ communityId })
      .populate("headId", "firstName lastName profilePic")
      .sort({ createdAt: -1 });

    const enriched = posts.map(p => ({
      ...p._doc,
      headId: {
        _id: p.headId._id,
        name: `${p.headId.firstName} ${p.headId.lastName}`,
        profileImage: p.headId.profilePic?.url
      }
    }));

    res.status(200).json(enriched);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 6. SEARCH POSTS BY TITLE
export const getPostsByTitle = async (req, res) => {
  try {
    const { title } = req.query;
    const posts = await Post.find({
      title: { $regex: title || "", $options: "i" },
      isPublic: true 
    })
    .populate("communityId", "name")
    .populate("headId", "firstName lastName profilePic");

    const enriched = posts.map(p => ({
      ...p._doc,
      headId: {
        _id: p.headId._id,
        name: `${p.headId.firstName} ${p.headId.lastName}`,
        profileImage: p.headId.profilePic?.url
      }
    }));

    res.status(200).json(enriched);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 7. GIVE REACTION
export const giveReaction = async (req, res) => {
  try {
    const { postId, emoji } = req.body;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const existingReaction = post.reactions.find(r => r.userId.toString() === userId.toString());

    if (existingReaction && existingReaction.emoji === emoji) {
      post.reactions = post.reactions.filter(r => r.userId.toString() !== userId.toString());
    } else {
      // Remove any existing reaction from this user first
      post.reactions = post.reactions.filter(r => r.userId.toString() !== userId.toString());
      post.reactions.push({ userId, emoji });
    }

    await post.save();
    res.status(200).json(post.reactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 8. GET POST BY ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("headId", "firstName lastName profilePic bio")
      .populate("communityId");

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Find the expert data associated with the head of this community
    const expert = await Expert.findOne({ userId: post.headId._id }).select("fieldOfExpertise");

    const enriched = {
      ...post._doc,
      headId: {
        _id: post.headId._id,
        name: `${post.headId.firstName} ${post.headId.lastName}`,
        profileImage: post.headId.profilePic?.url
      },
      communityId: {
        _id: post.communityId._id,
        // Fallback to Expert's name since Community model has no 'name' field
        name: `${post.headId.firstName} ${post.headId.lastName}`, 
        niche: expert?.fieldOfExpertise || "Expert"
      }
    };

    res.status(200).json(enriched);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 9. DELETE POST BY ID
export const deletePostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    
    const isHead = post.headId.toString() === req.user._id.toString();
    const isAdmin = req.user.roles?.includes("ADMIN");

    if (!isHead && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (post.media?.mediaId) {
      await cleanupMedia(post.media.mediaId);
    }

    await Post.deleteOne({ _id: post._id });

    res.status(200).json({
      success: true,
      message: "Post and its media deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};