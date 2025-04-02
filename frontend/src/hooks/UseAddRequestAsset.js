import toast from "react-hot-toast";
import { useState } from "react";
import { useAuthContext } from "../context/AuthContext.jsx";
const UseAddRequestAsset = () => {
  const [loading, setLoading] = useState(false);
  const { authUser } = useAuthContext();

  const add_request = async (
    assetType,
    specifications,
    softwareRequirements,
    assetNeed,
    expectedDuration,
    address
  ) => {
    setLoading(true);
    const requested_by = authUser.id;
    try {
      const res = await fetch("/api/asset/add_request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetType,
          requested_by,
          specifications,
          softwareRequirements,
          assetNeed,
          expectedDuration,
          address,
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

  return { loading, add_request };
};

export default UseAddRequestAsset;
