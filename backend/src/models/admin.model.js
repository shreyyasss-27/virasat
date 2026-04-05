import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 

    accessLevel: {
      type: String,
      enum: ["SUPER_ADMIN", "ADMIN", "MODERATOR", "REVIEWER"],
      default: "ADMIN",
    },

    assignedModules: {
      type: [String], 
      enum: ["HeritageBazaar", "DharoharTV", "Sangam", "Bhartiyam"],
      default: ["HeritageBazaar", "DharoharTV", "Sangam", "Bhartiyam"],
    },  
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
