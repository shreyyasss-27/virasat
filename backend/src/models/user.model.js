import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },

    lastName: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    bio: {
      type: String,
      default: ""
    },

    profilePic: {
      mediaId: { type: mongoose.Schema.Types.ObjectId, ref: "Media" },
      url: { type: String},
    },

    roles: {
      type: [String],
      enum: ["USER", "EXPERT", "ADMIN", "SELLER", "CREATOR"],
      default: ["USER"]
    },

    iSOnboarded: {
      type: Boolean,
      default: false
    },

    phoneNumber: {
      type: String,
      length: 10
    },

    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: String
    },

    bankDetails: { 
      accountHolderName: String,
      accountNumber: String,
      ifscCode: String, 
      bankName: String,
    },

    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_APPROVAL'],
      default: 'ACTIVE'
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password);
  return isPasswordCorrect;
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

const User = mongoose.model("User", userSchema);

export default User;