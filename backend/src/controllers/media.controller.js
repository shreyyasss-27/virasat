import Media from "../models/media.model.js";
import cloudinary from "../utils/cloudinary.js";
import mongoose from "mongoose";

export async function uploadMedia(req, res) {
  try {
    const { moduleName } = req.body; // Sent via FormData
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // 1. Logic for folder organization
    const isVideo = req.file.mimetype.startsWith("video/");
    const resourceType = isVideo ? "video" : "image";

    // Path example: virasat/heritageBazzar/images
    const folderPath = `virasat/${moduleName || "misc"}/${resourceType}s`;

    const base64 = req.file.buffer.toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${base64}`;

    // 2. Cloudinary Upload
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: folderPath,
      resource_type: "auto",
    });

    // 3. Save to MongoDB
    const savedMedia = await Media.create({
      url: result.secure_url,
      publicId: result.public_id,
      type: resourceType,
      module: moduleName, // Helpful for filtering later
    });

    res.status(201).json({ message: "Upload successful", media: savedMedia });
  } catch (err) {
    console.error("Cloudinary Error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
}
export async function cleanupMedia(mediaId) {
  console.log("--- Starting Cleanup for ID:", mediaId);

  // Ensure we are using a valid ObjectId
  const objId = typeof mediaId === 'string' ? new mongoose.Types.ObjectId(mediaId) : mediaId;

  const media = await Media.findById(objId);

  if (!media) {
    console.log("❌ Cleanup Failed: Media document not found in DB");
    return false;
  }

  console.log("Found Media Document. PublicID:", media.publicId);

  try {
    const resourceType = media.type === "video" ? "video" : "image";
    // Delete from Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.destroy(media.publicId, {
      resource_type: resourceType,
    });

    console.log("Cloudinary Response:", cloudinaryResponse);

    if (cloudinaryResponse.result !== "ok") {
      console.log("⚠️ Cloudinary warning: Result was not 'ok' (might already be deleted or wrong public_id)");
    }

    // Delete from Database
    await Media.findByIdAndDelete(objId);
    console.log("✅ Media document removed from MongoDB");
    return true;

  } catch (error) {
    console.error("❌ Error during Cloudinary Destroy:", error.message);
    throw error; // Throw so deleteProduct catches it
  }
};

export async function deleteMedia(req, res) {
  try {
    const deleted = await cleanupMedia(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Media not found" });

    res.json({ message: "Media deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
}