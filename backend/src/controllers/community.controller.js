import Community from "../models/community.model.js";
import Expert from "../models/expert.model.js";
import User from "../models/user.model.js";

const checkIsMember = (members, userId) => {
  if (!userId || !members) return false;
  return members.some((id) => id.toString() === userId.toString());
};

export const createCommunity = async (req, res) => {
  try {
    const userId = req.user._id;

    // Verify user is an Expert
    const expert = await Expert.findOne({ userId });
    if (!expert) return res.status(403).json({ message: "Only Experts can create a community" });

    // Prevent duplicates
    const existing = await Community.findOne({ headId: userId });
    if (existing) return res.status(400).json({ message: "Community already exists" });

    const newCommunity = await Community.create({
      headId: userId,
      members: [userId], // Head is the first member
    });

    res.status(201).json(newCommunity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCommunities = async (req, res) => {
  try {
    const userId = req.user?._id;

    // 1. Find all users who currently have the EXPERT role
    const activeExperts = await User.find({ roles: "EXPERT" }).select("_id");
    const expertIds = activeExperts.map((u) => u._id);

    // 2. Fetch communities belonging to those active experts
    const communities = await Community.find({ headId: { $in: expertIds } })
      .populate("headId", "firstName lastName bio profilePic")
      .lean();

    // 3. Enrich with live Expert niche data and membership status
    const enrichedCommunities = await Promise.all(
      communities.map(async (comm) => {
        const expert = await Expert.findOne({ userId: comm.headId._id }).select("fieldOfExpertise");
        return {
          _id: comm._id,
          name: `${comm.headId.firstName} ${comm.headId.lastName}`,
          description: comm.headId.bio,
          niche: expert?.fieldOfExpertise || "Expert",
          profilePic: comm.headId.profilePic?.url,
          memberCount: comm.members.length,
          isMember: checkIsMember(comm.members, userId), // <--- Added this
        };
      })
    );

    res.status(200).json(enrichedCommunities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCommunityById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    const comm = await Community.findById(id).populate("headId", "firstName lastName bio profilePic");

    if (!comm) return res.status(404).json({ message: "Community not found" });

    const expert = await Expert.findOne({ userId: comm.headId._id });

    res.status(200).json({
      _id: comm._id,
      name: `${comm.headId.firstName} ${comm.headId.lastName}`,
      bio: comm.headId.bio,
      niche: expert?.fieldOfExpertise,
      profilePic: comm.headId.profilePic?.url,
      memberCount: comm.members.length,
      isMember: checkIsMember(comm.members, userId), // <--- Use helper
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const toggleMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const community = await Community.findById(id);

    if (!community) return res.status(404).json({ message: "Community not found" });

    // Robust check for membership
    const isMember = checkIsMember(community.members, userId);

    if (isMember) {
      if (community.headId.toString() === userId.toString()) {
        return res.status(400).json({ message: "The Head cannot leave their own community" });
      }
      await Community.findByIdAndUpdate(id, { $pull: { members: userId } });
      res.status(200).json({ message: "Left community", joined: false });
    } else {
      await Community.findByIdAndUpdate(id, { $addToSet: { members: userId } });
      res.status(200).json({ message: "Joined community", joined: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchCommunities = async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.user?._id;
    if (!query) return res.status(400).json({ message: "Search query is required" });

    const matchingUsers = await User.find({
      roles: "EXPERT",
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
      ],
    }).select("_id");

    const userIdsFromName = matchingUsers.map((u) => u._id);

    const matchingExperts = await Expert.find({
      fieldOfExpertise: { $regex: query, $options: "i" },
    }).select("userId");

    const userIdsFromExpertiseRaw = matchingExperts.map((e) => e.userId);
    const validExpertiseUsers = await User.find({
      _id: { $in: userIdsFromExpertiseRaw },
      roles: "EXPERT",
    }).select("_id");

    const userIdsFromExpertise = validExpertiseUsers.map((u) => u._id);
    const allMatchingUserIds = [...new Set([...userIdsFromName, ...userIdsFromExpertise])];

    const communities = await Community.find({
      headId: { $in: allMatchingUserIds },
    }).populate("headId", "firstName lastName bio profilePic");

    const results = await Promise.all(
      communities.map(async (comm) => {
        const expert = await Expert.findOne({ userId: comm.headId._id }).select("fieldOfExpertise");
        return {
          _id: comm._id,
          name: `${comm.headId.firstName} ${comm.headId.lastName}`,
          bio: comm.headId.bio,
          niche: expert?.fieldOfExpertise || "Expert",
          profilePic: comm.headId.profilePic?.url,
          memberCount: comm.members.length,
          isMember: checkIsMember(comm.members, userId), // <--- Added this
        };
      })
    );

    res.status(200).json(results);
  } catch (error) {
    console.error("Search Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMyCommunities = async (req, res) => {
  try {
    const userId = req.user._id;

    const communities = await Community.find({ members: userId })
      .populate("headId", "firstName lastName bio profilePic")
      .lean();

    const results = await Promise.all(
      communities.map(async (comm) => {
        const expert = await Expert.findOne({ userId: comm.headId._id }).select("fieldOfExpertise");
        return {
          _id: comm._id,
          name: `${comm.headId.firstName} ${comm.headId.lastName}`,
          bio: comm.headId.bio,
          niche: expert?.fieldOfExpertise || "Expert",
          profilePic: comm.headId.profilePic?.url,
          memberCount: comm.members.length,
          isMember: true,
        };
      })
    );

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};