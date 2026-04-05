export type MediaType = "image" | "video";

export interface Media {
  resource_type: string;
  _id: string;

  // Cloudinary
  url: string;        // secure_url
  publicId: string;   // required for delete
  type: MediaType;    // image | video

  // Optional ownership (if auth-based)
  userId?: string;

  // Metadata (optional but useful)
  format?: string;    // jpg, png, mp4
  bytes?: number;     // file size
  duration?: number;  // only for video (seconds)
  width?: number;
  height?: number;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}
