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

router.post("/", protectRoute, createGroup);
router.get("/", protectRoute, getGroups);

// ✅ Use clear prefixes to avoid param conflicts
router.get("/id/:groupId", protectRoute, getGroupById);
router.put("/id/:groupId", protectRoute, updateGroup);
router.get("/id/:groupId/messages", protectRoute, getGroupMessages);
router.post("/id/:groupId/send", protectRoute, sendGroupMessage);

export default router;
