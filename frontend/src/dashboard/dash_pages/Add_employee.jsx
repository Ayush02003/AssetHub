import { useEffect, useState } from "react";
import "../../css/add_asset.css";
import axios from "axios";
import use_addEmployee from "../../hooks/UseAddEmployee.js";
import { useAuthContext } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";
const Add_employee = () => {
  const { authUser } = useAuthContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [department, setDept] = useState("");
  const [designation, setDesignation] = useState("Employee");
  const [address, setAddress] = useState("");
  const { loading, add_employee } = use_addEmployee();
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDept = async () => {
      try {
        const res = await axios.get("/api/company/get_dept");
        setDepartments(res.data.dept);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchDept();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await add_employee(name, email, mobile, department, designation, address);

    setName("");
    setEmail("");
    setMobile("");
    setDept("");
    setDesignation("");
    setAddress("");
  };

  return (
    <div>
      <div className="asset_main">
        <h2>ADD EMPLOYEE</h2>
        <div className="asset_form">
          <div className="asset-upper-part">
            <h4>Employee Information</h4>
          </div>
          <div className="asset-lower-part">
            <form onSubmit={handleSubmit}>
              <table>
                <tr>
                  <td>
                    <label>Name</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="fa-regular fa-user"></i>
                    <input
                      required
                      type="text"
                      placeholder="Enter employee name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </td>
                </tr>

                <tr>
                  <td>
                    <label>Email</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="fa-solid fa-envelope"></i>
                    <input
                      required
                      type="email"
                      placeholder="Enter employee email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </td>
                </tr>

                <tr>
                  <td>
                    <label>Phone Number</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="fa-solid fa-phone"></i>
                    <input
                      required
                      type="tel"
                      placeholder="Enter mobile number"
                      name="mobile_number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      minLength="10"
                      maxLength="10"
                      pattern="[0-9]{10}"
                      title="Phone number must be exactly 10 digits"
                    />
                  </td>
                </tr>

                <tr>
                  <td>
                    <label>Department</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="fa-solid fa-building"></i>
                    {authUser.dept.toLowerCase() === "all" ||
                    authUser.role === "Admin" ? (
                      <select
                        required
                        value={department}
                        onChange={(e) => setDept(e.target.value)}
                      >
                        <option value="" disabled>
                          Select a department
                        </option>

                        {authUser.role === "Admin" && (
                          <option value="ALL">ALL</option>
                        )}

                        {departments.filter((departments)=> departments.status.toLowerCase() != "inactive").
                        map((dept) => (
                          <option key={dept._id} value={dept.name}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input type="text" value={authUser.dept} readOnly />
                    )}
                  </td>
                </tr>

                <tr>
                  <td>
                    <label>Designation</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="fa-solid fa-building"></i>
                    {authUser.role === "Admin" || authUser.role === "HR" ? (
                      <select
                        className="designation-dropdown"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                      >
                        {(department.toLowerCase() !== "all" && authUser.role === "Admin") && (
                          <option value="Employee">Employee</option>
                        )}
                        {authUser.role === "Admin" && (
                          <>
                            <option value="HR">HR</option>
                            <option value="IT-Person">IT-Person</option>
                          </>
                        )}
                        {authUser.role === "HR" && authUser.dept === "All" && (
                          <>
                          <option value="HR">HR</option>
                            <option value="Employee">Employee</option>
                            <option value="IT-Person">IT-Person</option>
                          </>
                        )}
                        {authUser.role === "HR" && authUser.dept !== "All" && (
                          <>
                            <option value="Employee">Employee</option>
                            <option value="IT-Person">IT-Person</option>
                          </>
                        )}
                      </select>
                    ) : (
                      <input type="text" value={designation} readOnly />
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Address</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="fa-regular fa-address-card"></i>
                    <input
                      required
                      type="text"
                      placeholder="Enter employee address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </td>
                </tr>
                <input type="hidden" value={designation} />

                <tr>
                  <td className="button">
                    <button className="submit" type="submit" disabled={loading}>
                      {loading ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        "Add Employee"
                      )}
                    </button>
                    <input
                      className="reset"
                      type="reset"
                      value="Cancel"
                      onClick={() => {
                        setName("");
                        setEmail("");
                        setMobile("");
                        setDept("");
                        setDesignation("");
                        setAddress("");
                      }}
                    />
                  </td>
                </tr>
              </table>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add_employee;
