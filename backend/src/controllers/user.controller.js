import User from '../models/user.model.js';
import Creator from '../models/creator.model.js';
import Admin from '../models/admin.model.js'
import Expert from '../models/expert.model.js'
import Seller from '../models/seller.model.js'
import { cleanupMedia } from './media.controller.js';
import Community from '../models/community.model.js';

export async function getUserProfile(req, res) {
  try {
    const user = await User.findById(req.user._id).select('-password').lean();

    if (!user) return res.status(401).json({ message: "User not found" });

    if (user.roles.includes("EXPERT")) {
      const expertDetails = await Expert.findOne({ userId: user._id });
      user.expertDetails = {fieldOfExpertise: expertDetails.fieldOfExpertise, institution: expertDetails.institution, verified: expertDetails.verified};
      console.log(user)
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateUserProfile(req, res) {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.firstName = req.body.firstName !== undefined ? req.body.firstName : user.firstName;
    user.lastName = req.body.lastName !== undefined ? req.body.lastName : user.lastName;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    if (req.body.profilePic !== undefined && req.body.profilePic != null) {
      if (user.profilePic != null) {
        cleanupMedia(user.profilePic.mediaId);
      }
      user.profilePic = req.body.profilePic
    }
    user.iSOnboarded = req.body.iSOnboarded !== undefined ? req.body.iSOnboarded : user.iSOnboarded;
    user.phoneNumber = req.body.phoneNumber !== undefined ? req.body.phoneNumber : user.phoneNumber;

    // user.status = req.body.status !== undefined ? req.body.status : user.status;
    if (req.body.roles !== undefined) {
      user.roles = req.body.roles;
    }

    if (req.body.address) {
      user.address.street = req.body.address.street !== undefined ? req.body.address.street : (user.address ? user.address.street : undefined);
      user.address.city = req.body.address.city !== undefined ? req.body.address.city : (user.address ? user.address.city : undefined);
      user.address.state = req.body.address.state !== undefined ? req.body.address.state : (user.address ? user.address.state : undefined);
      user.address.pincode = req.body.address.pincode !== undefined ? req.body.address.pincode : (user.address ? user.address.pincode : undefined);
      user.address.country = req.body.address.country !== undefined ? req.body.address.country : (user.address ? user.address.country : undefined);
    }

    if (req.body.bankDetails) {
      if (!user.bankDetails) user.bankDetails = {};

      user.bankDetails.accountHolderName = req.body.bankDetails.accountHolderName !== undefined ? req.body.bankDetails.accountHolderName : user.bankDetails.accountHolderName;
      user.bankDetails.accountNumber = req.body.bankDetails.accountNumber !== undefined ? req.body.bankDetails.accountNumber : user.bankDetails.accountNumber;
      user.bankDetails.ifscCode = req.body.bankDetails.ifscCode !== undefined ? req.body.bankDetails.ifscCode : user.bankDetails.ifscCode;
      user.bankDetails.bankName = req.body.bankDetails.bankName !== undefined ? req.body.bankDetails.bankName : user.bankDetails.bankName;
    }


    if (req.body.email && req.body.email !== user.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      user.email = req.body.email;
    }

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    const roles = Array.isArray(updatedUser.roles) ? updatedUser.roles : [updatedUser.roles];

    for (const role of roles) {
      switch (role) {
        case "CREATOR":
          await handleCreatorRole(updatedUser._id, req.body.creatorDetails);
          break;

        case "ADMIN":
          await handleAdminRole(updatedUser._id, req.body.adminDetails);
          break;

        case "EXPERT":
          await handleExpertRole(updatedUser._id, req.body.expertDetails);
          break;

        case "SELLER":
          if (req.body.sellerDetails) {
            await handleSellerRole(updatedUser._id, req.body.sellerDetails);
          }
          break;
      }
    }

    const userResponse = {
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      bio: updatedUser.bio,
      profilePic: updatedUser.profilePic,
      roles: updatedUser.roles,
      iSOnboarded: true,
      phoneNumber: updatedUser.phoneNumber,
      address: updatedUser.address,
      status: updatedUser.status,
      bankDetails: {
        accountHolderName: updatedUser.bankDetails.accountHolderName,
        accountNumber: updatedUser.bankDetails.accountNumber,
        bankName: updatedUser.bankDetails.bankName,
        ifscCode: updatedUser.bankDetails.ifscCode
      },
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    if (user.roles.includes("EXPERT")) {
      const expertDetails = await Expert.findOne({ userId: user._id });
      userResponse.expertDetails = expertDetails;
    }
    
    res.status(200).json({
      message: "Profile and role details updated successfully",
      user: userResponse
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists, please use a different one" });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    console.error("Error in updateUserProfile controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteUser(req, res) {
  try {
    // Assumes deletion of the currently logged-in user's account
    await Community.deleteOne({ headId: req.user._id });
    const result = await User.deleteOne({ _id: req.user._id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // After successful deletion, clear the JWT cookie
    res.clearCookie("jwt");

    res.status(200).json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.log("Error in deleteUser controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getUsers(req, res) {
  try {
    // Note: You should have an authorization middleware that checks for Admin status
    // before this function runs in a real application.

    // Fetch all users, but exclude the 'password' field from the results
    const users = await User.find().select('-password');

    res.status(200).json({ success: true, count: users.length, users });

  } catch (error) {
    console.log("Error in getUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function handleCreatorRole(userId, details = {}) {
  let creator = await Creator.findOne({ userId });
  if (!creator) {
    creator = new Creator({ userId, ...details });
  } else {
    Object.assign(creator, details);
  }
  await creator.save();
}

async function handleAdminRole(userId, details = {}) {
  let admin = await Admin.findOne({ userId });
  if (!admin) {
    admin = new Admin({ userId, ...details });
  } else {
    Object.assign(admin, details);
  }
  await admin.save();
}

async function handleExpertRole(userId, details = {}) {
  // 1. Handle Expert Profile Update/Creation
  let expert = await Expert.findOne({ userId });
  if (!expert) {
    expert = new Expert({ userId, ...details });
  } else {
    Object.assign(expert, details);
  }
  await expert.save();

  // 2. Automated Community Creation
  // We check if a community already exists for this headId
  const existingCommunity = await Community.findOne({ headId: userId });
  
  if (!existingCommunity) {
    await Community.create({
      headId: userId,
      members: [userId] // Expert is the first member of their own community
    });
    console.log(`Community automatically created for Expert: ${userId}`);
  }
}

async function handleSellerRole(userId, details = {}) {
  let seller = await Seller.findOne({ userId });
  if (!seller) {
    seller = new Seller({ userId, ...details });
  } else {
    Object.assign(seller, details);
  }
  await seller.save();
}