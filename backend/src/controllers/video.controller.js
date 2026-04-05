import Video from "../models/video.model.js";
import mongoose from "mongoose";
import { cleanupMedia } from "../controllers/media.controller.js";

// @desc    Fetch all videos with pagination & search
// @route   GET /api/videos
export async function getVideos(req, res) {
  try {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
        $or: [
          { title: { $regex: req.query.keyword, $options: "i" } },
          { description: { $regex: req.query.keyword, $options: "i" } },
          { tags: { $regex: req.query.keyword, $options: "i" } },
        ],
      }
      : {};

    const categoryFilter = req.query.category ? { category: req.query.category } : {};
    const filter = { ...keyword, ...categoryFilter, isApproved: true };

    const count = await Video.countDocuments(filter);
    const videos = await Video.find(filter)
      .populate("creator", "firstName lastName profilePic")
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.status(200).json({
      success: true,
      videos,
      page,
      pages: Math.ceil(count / pageSize),
      count,
    });
  } catch (error) {
    console.error("Error in getVideos:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Get videos uploaded by the logged-in creator
export async function getVideosByCreator(req, res) {
  try {
    const videos = await Video.find({ creator: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(videos);
  } catch (error) {
    console.error("Error in getVideosByCreator:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Get single video by ID
// @desc    Get single video & track unique view
export async function getVideoById(req, res) {
  try {
    const videoId = req.params.id;

    console.log(req.user)

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Invalid Video ID" });
    }

    // 1. Update the views FIRST (if user is logged in)
    if (req.user) {
      await Video.findByIdAndUpdate(videoId, {
        $addToSet: { views: req.user._id }
      });
    }

    // 2. NOW fetch the video with the updated views and populations
    const video = await Video.findById(videoId)
      .populate("creator", "firstName lastName profilePic")
      .populate("comments.user", "firstName lastName profilePic");

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json(video);
  } catch (error) {
    console.error("getVideoById error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Upload/Create a new video
// @route   POST /api/videos
export async function createVideo(req, res) {
  try {
    const {
      title,
      description,
      videoUrl,
      mediaId,
      thumbnailUrl,
      thumbnailMediaId,
      category,
      duration,
      tags
    } = req.body;

    if (!title || !description || !videoUrl || !category || !duration) {
      return res.status(400).json({ message: "Missing required video fields" });
    }

    const video = new Video({
      creator: req.user._id,
      title,
      description,
      videoData: {
        url: videoUrl,
        mediaId: mediaId || null,
      },
      thumbnail: {
        url: thumbnailUrl,
        mediaId: thumbnailMediaId || null,
      },
      category,
      duration,
      tags: tags || [],
    });

    const createdVideo = await video.save();
    res.status(201).json({
      success: true,
      message: "Video uploaded successfully",
      video: createdVideo,
    });
  } catch (error) {
    console.error("Error in createVideo:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Update video details
export async function updateVideo(req, res) {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const isOwner = video.creator.toString() === req.user._id.toString();
    const isAdmin = req.user.roles.includes("ADMIN");

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // delete req.body.views;
    // delete req.body.likes;
    // delete req.body.comments;

    const allowedFields = ["title", "description", "category", "tags", "isApproved"];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        video[field] = req.body[field];
      }
    });

    const updatedVideo = await video.save();
    res.status(200).json({ success: true, video: updatedVideo });
  } catch (error) {
    console.error("updateVideo error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


// @desc    Delete video and cleanup media
export async function deleteVideo(req, res) {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const isOwner = video.creator.toString() === req.user._id.toString();
    const isAdmin = req.user.roles.includes("ADMIN");
    if (!isOwner && !isAdmin) return res.status(403).json({ message: "Not authorized" });

    // Cleanup nested media IDs
    if (video.videoData?.mediaId) await cleanupMedia(video.videoData.mediaId);
    if (video.thumbnail?.mediaId) await cleanupMedia(video.thumbnail.mediaId);

    await Video.deleteOne({ _id: video._id });

    res.status(200).json({ success: true, message: "Video and media deleted" });
  } catch (error) {
    console.error("Error in deleteVideo:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Add comment to video
export async function addComment(req, res) {
  try {
    const { comment } = req.body;
    const video = await Video.findById(req.params.id);

    if (!video) return res.status(404).json({ message: "Video not found" });

    const newComment = { user: req.user._id, comment };
    video.comments.push(newComment);
    await video.save();

    // Re-populate to send back the user details (name, pic) for the UI
    const updatedVideo = await Video.findById(req.params.id)
      .populate("comments.user", "firstName lastName profilePic");

    res.status(201).json({
      success: true,
      message: "Comment added",
      comments: updatedVideo.comments
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Toggle like/unlike a video
export async function toggleLikeVideo(req, res) {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const userId = req.user._id.toString();

    const isLiked = video.likes.some(
      id => id.toString() === userId
    );

    if (isLiked) {
      video.likes = video.likes.filter(
        id => id.toString() !== userId
      );
    } else {
      video.likes.push(req.user._id);
    }

    await video.save();

    res.status(200).json({
      success: true,
      likes: video.likes,
      isLiked: !isLiked,
    });
  } catch (error) {
    console.error("toggleLikeVideo error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
