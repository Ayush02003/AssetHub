import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const useDashStore = create((set, get) => ({
  users: [],
  assets: [],
  selectedUser: null,

  fetchAssets: async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/asset/get_asset");
      set({ assets: res.data.assets });
    } catch (error) {
      toast.error("Failed to fetch assets: " + error.message);
    }
  },
  fetchUsers: async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/emp/get_employee");
      set({ users: res.data.employees });
    } catch (error) {
      toast.error(error.message);
    }
  },
  viewUser: (id) => {
    const user = get().users.find((user) => user._id === id);
    if (user) {
      set({ selectedUser: user });
    } else {
      toast.error("Users not found!");
    }
  },
  deleteUser: async (userId) => {
    try {
      await axios.delete(`/api/emp/delete_employee${userId}`);
      set((state) => ({
        users: state.users.filter((user) => user.id !== userId),
        selectedUser:
          state.selectedUser?.id === userId ? null : state.selectedUser,
      }));
      toast.success("User Deleted Successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  },
  allocatedAssetUserByAssetId: async (assetId) => {
    try {
      const res = await axios.get(
        `/api/asset/allocatedAsset_UserBy_AssetId?assetId=${assetId}`
      );
      set({ selectedUser: res.data.user ? res.data.user : null });
    } catch (error) {
      console.error("Error fetching allocated user:", error);
      set({ selectedUser: null });
    }
  },

  updateUser: async (userData) => {
    try {
      await axios.put(
        `http://localhost:8000/api/emp/update_employee`,
        userData
      );
      set((state) => ({
        users: state.users.map((user) =>
          user._id === userData.id ? { ...user, ...userData } : user
        ),
        selectedUser:
          state.selectedUser?._id === userData.id
            ? { ...state.selectedUser, ...userData }
            : state.selectedUser,
      }));
      toast.success("User updated successfully!");
    } catch (error) {
      toast.error("Error updating user!");
      console.error("Error updating user:", error);
    }
  },
  updatePassword: async (username, passwordData) => {
    try {
      await axios.put(`http://localhost:8000/api/emp/update_password`, {
        username,
        ...passwordData,
      });
      toast.success("Password updated successfully!");
    } catch (error) {
      // toast.error("Old Password is not correct");
      toast.error(error.response.data.error);
    }
  },
}));
export default useDashStore;
