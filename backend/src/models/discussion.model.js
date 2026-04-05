import mongoose from "mongoose";

const discussionSchema =  mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  
  questionTitle: { type: String, required: true },
  questionDetails: { type: String },

  replies: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],

  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isResolved: { type: Boolean, default: false }
}, { timestamps: true })

const Discussion = mongoose.model("Discussion", discussionSchema)

export default Discussion