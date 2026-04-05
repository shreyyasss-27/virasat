import mongoose from "mongoose";

const expertSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    fieldOfExpertise: {
      type: String,
      required: true,
    },

    institution: {
      type: String,
      default: "",
    },

    verified: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Expert = mongoose.model("Expert", expertSchema);
export default Expert;
