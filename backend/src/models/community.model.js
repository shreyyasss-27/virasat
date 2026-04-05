import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
  headId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    unique: true
  },
  members: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }]
}, { timestamps: true });

const Community = mongoose.model("Community", communitySchema);
export default Community;