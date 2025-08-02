import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { Camera, Users, X } from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useNavigate, useParams } from "react-router-dom"; // ✅ Added useParams

const CreateGroup = () => {
  const { authUser } = useAuthStore();
  const { users, getUsers } = useChatStore();

  const [groupName, setGroupName] = useState("");
  const [groupPic, setGroupPic] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams(); // ✅ Will be undefined if creating new

  // Load all users
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // ✅ If editing, load group details
  useEffect(() => {
    if (id) {
      // means /groups/:id/edit
      const fetchGroup = async () => {
        try {
          const res = await axiosInstance.get(`/groups/${id}`);
          const group = res.data;

          setGroupName(group.name);
          setGroupPic(group.icon);
          setSelectedMembers(group.members);
        } catch (err) {
          toast.error("Failed to load group data");
          console.error(err);
        }
      };

      fetchGroup();
    }
  }, [id]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setGroupPic(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const toggleMember = (user) => {
    if (selectedMembers.some((m) => m._id === user._id)) {
      setSelectedMembers(selectedMembers.filter((m) => m._id !== user._id));
    } else {
      setSelectedMembers([...selectedMembers, user]);
    }
  };

  const handleSaveGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Group name is required");
      return;
    }

    if (selectedMembers.length < 2) {
      toast.error("Add at least 2 members");
      return;
    }

    try {
      if (id) {
        // ✅ EDIT MODE
        await axiosInstance.put(`/groups/${id}`, {
          name: groupName,
          icon: groupPic,
          members: selectedMembers.map((m) => m._id),
        });

        toast.success("Group updated!");
      } else {
        // ✅ CREATE MODE
        await axiosInstance.post("/groups", {
          name: groupName,
          icon: groupPic,
          members: selectedMembers.map((m) => m._id),
        });

        toast.success("Group created!");
      }

      navigate("/"); // ✅ Go back after success
    } catch (error) {
      console.error("Save group error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Failed to save group"
      );
    }
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">
              {id ? "Edit Group" : "Create Group"}
            </h1>
            <p className="mt-2">
              {id ? "Update group details" : "Set group details and add members"}
            </p>
          </div>

          {/* Group avatar upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={groupPic || "/group.png"}
                alt="Group"
                className="size-32 rounded-full object-cover border-4"
              />
              <label
                htmlFor="group-avatar-upload"
                className="absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200"
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="group-avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              Click the camera icon to change group photo
            </p>
          </div>

          {/* Group name */}
          <div className="space-y-1.5">
            <label className="text-sm text-zinc-400 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Group Name
            </label>
            <input
              type="text"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-2.5 bg-base-200 rounded-lg border"
            />
          </div>

          {/* Selected Members */}
          {selectedMembers.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Selected Members:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedMembers.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center gap-1 px-3 py-1 bg-base-200 rounded-full"
                  >
                    <img
                      src={member.profilePic || "/avatar.png"}
                      alt={member.fullName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm">{member.fullName}</span>
                    <button onClick={() => toggleMember(member)} className="ml-1">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User list */}
          <div>
            <h3 className="text-sm font-medium mb-2">Add/Remove Members:</h3>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {users
                .filter((u) => u._id !== authUser._id)
                .map((user) => (
                  <button
                    key={user._id}
                    onClick={() => toggleMember(user)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border hover:bg-base-200 ${
                      selectedMembers.some((m) => m._id === user._id)
                        ? "bg-base-200"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.profilePic || "/avatar.png"}
                        alt={user.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span>{user.fullName}</span>
                    </div>
                    {selectedMembers.some((m) => m._id === user._id) && (
                      <span className="text-xs text-green-500">Added</span>
                    )}
                  </button>
                ))}
            </div>
          </div>

          {/* Save button */}
          <button
            onClick={handleSaveGroup}
            className="btn btn-primary w-full"
          >
            {id ? "Update Group" : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
