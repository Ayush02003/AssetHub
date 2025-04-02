import toast from "react-hot-toast";
import { useState } from "react";
import { useAuthContext } from "../context/AuthContext.jsx";
const UseAddSoftware = () => {
  const { authUser } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const add_software = async (
    installation_type,
    assigned_laptop_id,
    name,
    version,
    license_type,
    license_key,
    expiration_date
  ) => {
    setLoading(true);
    const installed_by = authUser.id;
    try {
      const res = await fetch("/api/asset/add_software", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          installed_by,
          installation_type,
          assigned_laptop_id,
          name,
          version,
          license_type,
          license_key,
          expiration_date,
        }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      toast.success("Software Added Successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, add_software };
};

export default UseAddSoftware;
