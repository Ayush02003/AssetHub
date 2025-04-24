import toast from "react-hot-toast";
import { useState } from "react";
import { useAuthContext } from "../context/AuthContext.jsx";



const UseAddAssetReturn = () => {
  const [loading, setLoading] = useState(false);
  const { authUser } = useAuthContext();

  const assetReturn = async (
    assignedLaptopId, condition, return_reason
  ) => {
    setLoading(true);
    const requested_by = authUser.id;
    try {
     
      const res = await fetch("/api/asset/asset_return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            assignedLaptopId, condition, return_reason, requested_by
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

  return { loading, assetReturn };
};

export default UseAddAssetReturn;
