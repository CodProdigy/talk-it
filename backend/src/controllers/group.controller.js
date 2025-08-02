import Group from "../models/group.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getIO } from "../lib/socket.js";

// ✅ Create group
export const createGroup = async (req, res) => {
  try {
    const { name, icon, members } = req.body;
    const createdBy = req.user._id;

    if (!name || !members || members.length < 2) {
      return res.status(400).json({
        message: "Group name and at least 2 members are required",
      });
    }

    const existingGroup = await Group.findOne({ name, createdBy });
    if (existingGroup) {
      return res
        .status(400)
        .json({ message: "You already have a group with this name" });
    }

    let iconUrl = "";
    if (icon) {
      const uploadRes = await cloudinary.uploader.upload(icon);
      iconUrl = uploadRes.secure_url;
    }

    const allMembers = members.includes(createdBy.toString())
      ? members
      : [...members, createdBy];

    const newGroup = new Group({
      name,
      icon: iconUrl,
      members: allMembers,
      createdBy,
    });

    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    console.error("Error in createGroup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get groups for user
export const getGroups = async (req, res) => {
  try {
    const userId = req.user._id;
    const groups = await Group.find({ members: userId })
      .populate("members", "-password")
      .populate("createdBy", "-password");

    res.status(200).json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get single group by ID
export const getGroupById = async (req, res) => {
  try {
    const groupId = req.params.id;

    const group = await Group.findById(groupId)
      .populate("members", "-password")
      .populate("createdBy", "-password");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(group);
  } catch (error) {
    console.error("Error fetching group by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get messages for a group
export const getGroupMessages = async (req, res) => {
  try {
    const groupId = req.params.id;

    const messages = await Message.find({ roomId: groupId })
      .populate("senderId", "-password")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching group messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Send message to a group
export const sendGroupMessage = async (req, res) => {
  try {
    const groupId = req.params.id;
    const { text, image } = req.body;

    const newMessage = new Message({
      roomId: groupId,
      senderId: req.user._id,
      text,
      image,
    });

    await newMessage.save();
    await newMessage.populate("senderId", "-password");

    const io = getIO();
    io.to(groupId).emit("groupMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending group message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Update group (name, icon, members)
export const updateGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const { name, icon, members } = req.body;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.createdBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this group" });
    }

    if (name && name !== group.name) {
      const duplicate = await Group.findOne({
        name,
        createdBy: userId,
        _id: { $ne: groupId },
      });
      if (duplicate) {
        return res
          .status(400)
          .json({ message: "You already have another group with this name" });
      }
      group.name = name;
    }

    if (icon && icon.startsWith("data:image")) {
      const uploadRes = await cloudinary.uploader.upload(icon);
      group.icon = uploadRes.secure_url;
    }

    if (Array.isArray(members)) {
      const withCreator = [...members, userId.toString()];
      group.members = [...new Set(withCreator)];
    }

    await group.save();
    await group.populate("members createdBy", "-password");

    res.status(200).json(group);
  } catch (error) {
    console.error("Error updating group:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
