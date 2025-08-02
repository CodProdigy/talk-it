import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  // --- STATE ---
  messages: [],
  users: [],
  groups: [],
  selectedUser: null,
  selectedGroup: null,
  isUsersLoading: false,
  isGroupsLoading: false,
  isMessagesLoading: false,

  // --- USERS ---
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // --- GROUPS ---
  getGroups: async () => {
    set({ isGroupsLoading: true });
    try {
      const res = await axiosInstance.get("/groups");
      set({ groups: res.data });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load groups");
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  // --- MESSAGES ---
  getMessages: async () => {
    const { selectedUser, selectedGroup } = get();
    if (!selectedUser && !selectedGroup) return;

    set({ isMessagesLoading: true });

    try {
      let res;
      if (selectedUser) {
        res = await axiosInstance.get(`/messages/${selectedUser._id}`);
      } else {
        res = await axiosInstance.get(`/messages/group/${selectedGroup._id}`);
      }
      set({ messages: res.data });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (data) => {
    const { selectedUser, selectedGroup, messages } = get();
    if (!selectedUser && !selectedGroup) {
      toast.error("No user or group selected");
      return;
    }
    try {
      let res;
      if (selectedUser) {
        res = await axiosInstance.post(
          `/messages/send/${selectedUser._id}`,
          data
        );
      } else {
        res = await axiosInstance.post(`/messages/group/send`, {
          ...data,
          roomId: selectedGroup._id,
        });
      }
      set({ messages: [...messages, res.data] });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send message");
    }
  },

  // ✅ Subscriptions for user AND group
  subscribeToMessages: () => {
    const { selectedUser, selectedGroup } = get();
    const socket = useAuthStore.getState().socket;

    if (selectedUser) {
      const userId = selectedUser._id;
      socket.on("newMessage", (msg) => {
        if (msg.senderId === userId || msg.receiverId === userId) {
          set({ messages: [...get().messages, msg] });
        }
      });
    }

    if (selectedGroup) {
      const groupId = selectedGroup._id;
      socket.emit("joinGroup", { groupId });
      socket.on("groupMessage", (msg) => {
        if (msg.roomId === groupId) {
          set({ messages: [...get().messages, msg] });
        }
      });
    }
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    const { selectedGroup } = get();

    socket.off("newMessage");
    socket.off("groupMessage");

    if (selectedGroup) {
      socket.emit("leaveGroup", { groupId: selectedGroup._id });
    }
  },

  // --- SELECT ---
  setSelectedUser: (selectedUser) =>
    set({ selectedUser, selectedGroup: null, messages: [] }),
  setSelectedGroup: (selectedGroup) =>
    set({ selectedGroup, selectedUser: null, messages: [] }),
}));
