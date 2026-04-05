import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  headId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  communityId: { type: mongoose.Schema.Types.ObjectId, ref: "Community", required: true },
  title: { type: String, required: true },
  description: { type: Object },
  media: {
    url: { type: String },
    fileType: { type: String, enum: ['image', 'video', 'pdf', 'none'], default: 'none' },
    fileName: { type: String }
  },
  reactions: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      emoji: { type: String }
    }],
  isPublic: { type: Boolean, default: true }
}, {
  timestamps: true
})

const Post = mongoose.model("Post", postSchema)
export default Post;