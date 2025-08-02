import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createGroup,
  getGroups,
  getGroupById, // ✅ Added
  updateGroup,
  getGroupMessages,
  sendGroupMessage,
} from "../controllers/group.controller.js";

const router = express.Router();

// Create a new group
router.post("/", protectRoute, createGroup);

// Get groups for logged-in user
router.get("/", protectRoute, getGroups);

// ✅ Get single group by ID
router.get("/:id", protectRoute, getGroupById);

// Update group
router.put("/:id", protectRoute, updateGroup);

// Get messages for a group
router.get("/:id/messages", protectRoute, getGroupMessages);

// Send a message to a group
router.post("/send/:id", protectRoute, sendGroupMessage);

export default router;
