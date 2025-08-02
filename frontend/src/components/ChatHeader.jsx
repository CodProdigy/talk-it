import { X, Pencil } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useNavigate } from "react-router-dom"; // ✅ ADDED

const ChatHeader = () => {
  const { selectedUser, selectedGroup, setSelectedUser, setSelectedGroup } =
    useChatStore();
  const { onlineUsers } = useAuthStore();

  const navigate = useNavigate(); // ✅ ADDED

  const handleEditGroup = () => {
    if (selectedGroup) {
      // ✅ Pass group ID or data as needed
      navigate(`/groups/${selectedGroup._id}/edit`);
    }
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={
                  selectedUser
                    ? selectedUser.profilePic || "/avatar.png"
                    : selectedGroup?.icon || "/group.png"
                }
                alt={selectedUser ? selectedUser.fullName : selectedGroup?.name}
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium">
              {selectedUser ? selectedUser.fullName : selectedGroup?.name}
            </h3>
            {selectedUser && (
              <p className="text-sm text-base-content/70">
                {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* ✅ Show Edit if a group is selected */}
          {selectedGroup && (
            <button
              onClick={handleEditGroup}
              className="p-2 hover:bg-base-200 rounded-full"
              title="Edit Group"
            >
              <Pencil size={18} />
            </button>
          )}
          <button
            onClick={() =>
              selectedUser ? setSelectedUser(null) : setSelectedGroup(null)
            }
            className="p-2 hover:bg-base-200 rounded-full"
            title="Close Chat"
          >
            <X />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
