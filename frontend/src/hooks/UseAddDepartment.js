import toast from "react-hot-toast";
import { useState } from "react";


const UseAddDepartment = () => {
  const [loading, setLoading] = useState(false);

  const add_dept = async (departmentName, description, status) => {
    setLoading(true);

    try {
      const res = await fetch("/api/company/add_dept", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ departmentName, description, status }),
      });

      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      toast.success("Department Added Successfully!");
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  };

  return { loading, add_dept };
};

export default UseAddDepartment;
