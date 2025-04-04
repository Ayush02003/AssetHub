import toast from "react-hot-toast";
import { useState } from "react";

const UseAddAssetType = () => {
  const [loading, setLoading] = useState(false);

  const add_asset_type = async (assetType, description, status, fields) => {
    setLoading(true);
    try {
      const res = await fetch("/api/company/add_assetType", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type:assetType, description, status, fields }), 
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add asset type");
      }

      toast.success("Asset Type Added Successfully!");
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return { loading, add_asset_type };
};

export default UseAddAssetType;
