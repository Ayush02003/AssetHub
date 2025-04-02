import toast from "react-hot-toast";
import { useState } from "react";



const UseAddEmployee = () => {
  const [loading, setLoading] = useState(false);

  const add_employee = async (name, email, mobile, department, designation,address) => {
    setLoading(true);

    try {
      const res = await fetch("/api/emp/add_employee", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, mobile, department, designation,address }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      toast.success("Employee Added Successfully!");
    } catch (error) {
      console.log(error)
      toast.error("Email already registered.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, add_employee };
};

export default UseAddEmployee;
