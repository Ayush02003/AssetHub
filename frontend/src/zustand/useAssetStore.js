import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const useAssetStore = create((set) => ({
  assets: [],
  selectedAsset: null,
  installedSoftware: [],
  allocatedAssets: [],
  fetchAssets: async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/asset/get_asset");
      set({ assets: res.data.assets });
    } catch (error) {
      toast.error("Failed to fetch assets: " + error.message);
    }
  },

  viewAsset: (asset) => {
    set({ selectedAsset: asset, installedSoftware: [] });
  },

  fetchInstalledSoftware: async (assetId) => {
    if (!assetId) return;
    try {
      const res = await axios.get(
        `/api/asset/get_installed_software?asset_id=${assetId}`
      );
      set({ installedSoftware: res.data.software || [] });
    } catch (error) {
      toast.error("Failed to fetch installed software." + error);
    }
  },

  deleteAsset: async (assetId) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/asset/delete_asset/${assetId}`
      );
      set((state) => ({
        assets: state.assets.filter((asset) => asset._id !== assetId),
        selectedAsset:
          state.selectedAsset?._id === assetId ? null : state.selectedAsset,
      }));
      toast.success("Asset deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete asset." + error);
    }
  },
  allocatedAsset: async (requestId) => {
    try {
      const response = await axios.get(
        `/api/asset/allocated_asset?requestId=${requestId}`
      );
      set(() => ({ 
        selectedAsset: response.data.asset || null,
      }));
    } catch (error) {
      console.error("Failed to fetch asset.", error);
      set(() => ({
        selectedAsset: null,
      }));
    }
  },
  allocatedAssetUser: async (userId) => {
    try {
      const response = await axios.get(
        `/api/asset/allocated_asset_user?userId=${userId}`
      );
      const allocatedAssets = response.data.assets || [];

      const installedSoftwareMap = {};
      await Promise.all(
        allocatedAssets.map(async (asset) => {
          try {
            const softwareRes = await axios.get(
              `/api/asset/get_installed_software?asset_id=${asset._id}`
            );
            installedSoftwareMap[asset._id] = softwareRes.data.software || [];
          } catch (error) {
            console.error(
              `Failed to fetch software for asset ${asset._id}`,
              error
            );
            installedSoftwareMap[asset._id] = [];
          }
        })
      );

      set(() => ({
        allocatedAssets,
        installedSoftwareMap,
      }));
    } catch (error) {
      console.error("Failed to fetch allocated assets.", error);
      set(() => ({
        allocatedAssets: [],
        installedSoftwareMap: {},
      }));
    }
  },
  updateAsset: async (assetData) => {
    try {
      await axios.put(
        `http://localhost:8000/api/asset/update_asset`,
        assetData
      );
      set((state) => ({         
        assets: state.assets.map((asset) =>
          asset._id === assetData.id ? { ...asset, ...assetData } : asset
        ),
        selectedAsset:            
          state.selectedAsset?._id === assetData.id
            ? { ...state.selectedAsset, ...assetData }
            : state.selectedAsset,
      }));
      toast.success("Asset updated successfully!");
    } catch (error) {
      toast.error("Error updating asset!");
      console.error("Error updating asset:", error);
    }
  },
  updateSoftware: async (softwareData) => {
    try {
      await axios.put(
        `http://localhost:8000/api/asset/update_software`,
        softwareData
      );
      set((state) => ({         
        installedSoftware: state.installedSoftware.map((software) =>
          software._id === softwareData.id ? { ...software, ...softwareData } : software
        ),
      }));
      toast.success("Software updated successfully!");
    } catch (error) {
      toast.error("Error updating software!");
      console.error("Error updating software:", error);
    }
  },
}));

export default useAssetStore;
