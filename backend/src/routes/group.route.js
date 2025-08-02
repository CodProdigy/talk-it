import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  getGroupMessages,
  sendGroupMessage,
} from "../controllers/group.controller.js";

const router = express.Router();

// ✅ Create a new group
router.post("/", protectRoute, createGroup);

// ✅ Get all groups for the logged-in user
router.get("/", protectRoute, getGroups);

// ✅ Get single group by ID
router.get("/:groupId", protectRoute, getGroupById);

// ✅ Update group
router.put("/:groupId", protectRoute, updateGroup);

// ✅ Get messages for group
router.get("/:groupId/messages", protectRoute, getGroupMessages);

// ✅ Send message to group
router.post("/:groupId/send", protectRoute, sendGroupMessage);

export default router;
