import toast from "react-hot-toast";
import { useState } from "react";
import { useAuthContext } from "../context/AuthContext.jsx";

const CLOUD_NAME = "doiisgt6r";
const UPLOAD_PRESET = "AssetPics";

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, 
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Upload failed");
    }
    return data.secure_url;
  } catch (error) {
    toast.error("Cloudinary upload failed: " + error.message);
    return null;
  }
};

const UseAddAssetHelp = () => {
  const [loading, setLoading] = useState(false);
  const { authUser } = useAuthContext();

  const requestAssetIssue = async (
    assignedLaptopId,
    type,
    file,
    lost_date,
    description
  ) => {
    setLoading(true);
    const requested_by = authUser.id;
    try {
      const file1 = file ? await uploadToCloudinary(file) : "";
      if (!file1) {
        toast.error("File upload failed. Please try again.");
        setLoading(false);
        return;
      }
      const res = await fetch("/api/asset/add_asset_issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignedLaptopId,
          type,
          description,
          requested_by,
          file:file1,
          ...(type === "lost" && lost_date ? { lost_date } : {}),
        }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      toast.success(data.message);
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, requestAssetIssue };
};

export default UseAddAssetHelp;
