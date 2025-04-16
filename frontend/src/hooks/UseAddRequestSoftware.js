import toast from "react-hot-toast";
import { useState } from "react";
import { useAuthContext } from "../context/AuthContext.jsx";
const UseAddRequestSoftware = () => {
  const [loading, setLoading] = useState(false);
  const { authUser } = useAuthContext();

  const request_software = async (
    assignedLaptopId,
    name,
    version,
    // assetType,
    software_purpose,
    expected_duration
  ) => {
    setLoading(true);
    const requested_by = authUser.id;
    try {
      const res = await fetch("/api/asset/add_software_request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignedLaptopId,
          requested_by,
          name,
          version,
          software_purpose,
          expected_duration,
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

  return { loading, request_software };
};

export default UseAddRequestSoftware;
