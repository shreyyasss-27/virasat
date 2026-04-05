import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    role: { type: String, enum: ['user', 'model'], required: true },
    parts: [{ text: { type: String, required: true } }]
});

const conversationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, default: 'New Chat' },
    messages: [messageSchema],
    createdAt: { type: Date, default: Date.now }
});

conversationSchema.index({ title: "text" });

const Conversation = mongoose.model("Conversation", conversationSchema)

export default Conversation