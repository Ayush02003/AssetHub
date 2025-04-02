import toast from "react-hot-toast";
import { useState } from "react";

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

const UseAddAsset = () => {
  const [loading, setLoading] = useState(false);

  const add_asset = async (name, type, serial_num, price,desc,  brand, purchase_date, warranty_exp, pic1File, pic2File) => {
    console.log("add_asset function called"); 
    setLoading(true);

    try {
      const pic1 = pic1File ? await uploadToCloudinary(pic1File) : "";
      const pic2 = pic2File ? await uploadToCloudinary(pic2File) : "";

      if (!pic1 || !pic2) {
        throw new Error("Image upload failed. Please try again.");
      }
      console.log(name, type, serial_num, price,desc,  brand, purchase_date, warranty_exp, pic1File, pic2File)
      const res = await fetch("/api/asset/add_asset", { 
        method: "POST",  
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type, serial_num, price, desc, brand, purchase_date, warranty_exp, pic1, pic2 }),
      });
 
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error); 
      }
 
      toast.success("Asset Added Successfully!");
    } catch (error) { 
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, add_asset };
};

export default UseAddAsset;
