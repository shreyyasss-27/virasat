import User from "../models/user.model.js"
import jwt from "jsonwebtoken"

export async function signup(req, res){
  const { email, password, firstName, lastName } = req.body;

  try {
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists, please use a diffrent one" });
    }

    const newUser = await User.create({
      email,
      firstName,
      lastName,
      password,
    });

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none", // required for cross-domain cookies
      secure: true, // required for cross-domain cookies
    });

    res.status(201).json({user: newUser });

  } catch(error){
    console.log("Error in signup controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none", // required for cross-domain cookies
      secure: true, // required for cross-domain cookies
    });

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logout successful" });
}

export async function updateProfile(req, res) {
  try {
    const userId = req.user._id;
    const { firstName, lastName, bio, phoneNumber, roles, profilePic, address, bankDetails } = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update basic fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (bio !== undefined) user.bio = bio;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (profilePic) user.profilePic = profilePic;
    if (address) user.address = address;
    if (bankDetails) user.bankDetails = bankDetails;

    // Update roles if provided
    if (roles && Array.isArray(roles)) {
      const validRoles = ["USER", "EXPERT", "ADMIN", "SELLER", "CREATOR"];
      user.roles = roles.filter(role => validRoles.includes(role));
      console.log("Updated user roles:", user.roles);
    }

    await user.save();

    // Return updated user without password
    const userResponse = user.toJSON();
    res.status(200).json({ 
      success: true, 
      message: "Profile updated successfully", 
      user: userResponse 
    });

  } catch (error) {
    console.error("Error in updateProfile:", error.message);
    res.status(500).json({ message: "Failed to update profile" });
  }
}