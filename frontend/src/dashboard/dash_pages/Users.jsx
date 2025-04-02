import { useEffect, useState } from "react";
import "../../css/users.css";
import useUserStore from "../../zustand/useUserStore.js";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuthContext } from "../../context/AuthContext.jsx";
import Swal from "sweetalert2";
import { NavLink } from "react-router-dom";
const Users = () => {
  const { users, fetchUsers, deleteUser, viewUser } = useUserStore();
  const { authUser } = useAuthContext();
  const [departments, setDepartments] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterDesignation, setFilterDesignation] = useState("");
  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(filterName.toLowerCase()) &&
      user.email.toLowerCase().includes(filterEmail.toLowerCase()) &&
      (filterDept ? user.department === filterDept : true) &&
      (filterDesignation ? user.designation === filterDesignation : true)
    );
  });
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDesignationChange = async (userId, newDesignation) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to change the designation?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, change designation!",
      cancelButtonText: "No, cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put("/api/emp/update_designation", {
            userId,
            newDesignation,
          });
          fetchUsers();
          toast.success("Designation updated successfully!");
        } catch (error) {
          toast.error("Failed to update designation " + error.message);
        }
      }
    });
  };
  const handleDepartmentChange = async (userId, newDepartment) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to change the department?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, change department!",
      cancelButtonText: "No, cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put("http://localhost:8000/api/emp/update_department", {
            userId,
            newDepartment,
          });
          fetchUsers();
          toast.success("Department updated successfully!");
        } catch (error) {
          toast.error("Failed to update designation " + error.message);
        }
      }
    });
  };
  return (
    <div className="user-main">
      <div className="upper-component">
        <h2>User Management</h2>
        <hr />
        <div className="filter-container">
          <div>
            <input
              type="text"
              placeholder="Search by Name"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
            <i className="fa fa-user"></i>
          </div>

          <div>
            <input
              type="text"
              placeholder="Search by Email"
              value={filterEmail}
              onChange={(e) => setFilterEmail(e.target.value)}
            />
            <i className="fa fa-envelope"></i>
          </div>

          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>

          <select
            value={filterDesignation}
            onChange={(e) => setFilterDesignation(e.target.value)}
          >
            <option value="">All Designation</option>
            <option value="HR">HR</option>
            <option value="IT-Person">IT-Person</option>
            <option value="Employee">Employee</option>
          </select>
        </div>
      </div>

      <div className="lower-component">
        <div className="inner-component">
          <table>
            <thead>
              <tr id="title">
                <td>Sr No.</td>
                <td>Name</td>
                <td>Email</td>
                <td>Department</td>
                <td>Designation</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {authUser.role === "Admin" &&
                (filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr
                      key={user._id}
                      style={{
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <td>{index + 1}</td>
                      <td
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "20px",
                        }}
                      >
                        <img
                          src={`https://avatar.iran.liara.run/public/boy?${user.name}`}
                          style={{
                            boxShadow: "0px 0px 3px gray",
                            width: "45px",
                            height: "45px",
                            objectFit: "cover",
                            borderRadius: "30px",
                          }}
                          alt=""
                        />
                        <span>{user.name}</span>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        {authUser.role == "Admin" ? (
                          <select
                            className="designation-dropdown"
                            value={user.department}
                            onChange={(e) => {
                              const selectedValue = e.target.value;
                              handleDepartmentChange(user._id, selectedValue);
                            }}
                          >
                            {departments.map((dept) => (
                              <option key={dept._id} value={dept.name}>
                                {dept.name}
                              </option>
                            ))}
                            {user.designation !== "Employee" && (
                              <option value="All">All</option>
                            )}
                          </select>
                        ) : (
                          user.department
                        )}
                      </td>
                      <td>
                        {authUser.role == "Admin" ? (
                          <select
                            className="designation-dropdown"
                            value={user.designation}
                            onChange={(e) => {
                              const selectedValue = e.target.value;
                              handleDesignationChange(user._id, selectedValue);
                            }}
                          >
                            {user.department.toLowerCase() !== "all" && (
                              <>
                                <option value="Employee">Employee</option>
                              </>
                            )}
                            <option value="HR">HR</option>
                            <option value="IT-Person">IT-Person</option>
                          </select>
                        ) : (
                          user.designation
                        )}
                      </td>
                      <td>
                        <NavLink to="/dashboard/users/user_detail">
                          <button
                            className="icon-button view"
                            onClick={() => viewUser(user._id)}
                          >
                            <i className="fa fa-eye" aria-hidden="true"></i>
                          </button>
                        </NavLink>
                        <button
                          className="icon-button delete"
                          onClick={() => deleteUser(user._id)}
                        >
                          <i className="fa fa-trash" aria-hidden="true"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No users found
                    </td>
                  </tr>
                ))}

              {authUser.role === "HR" &&
                (filteredUsers.length > 0 ? (
                  filteredUsers
                    .filter((user) =>
                      authUser.dept === "All"
                        ? true
                        : user.department === "All" ||
                          user.department === authUser.dept
                    )
                    .filter((user) => authUser.id !== user._id)
                    .map((user, index) => (
                      <tr
                        key={user._id}
                        style={{
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        <td>{index + 1}</td>
                        <td
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "20px",
                          }}
                        >
                          <img
                            src={`https://avatar.iran.liara.run/public/boy?${user.name}`}
                            style={{
                              boxShadow: "0px 0px 3px gray",
                              width: "45px",
                              height: "45px",
                              objectFit: "cover",
                              borderRadius: "30px",
                            }}
                            alt=""
                          />
                          <span>{user.name}</span>
                        </td>
                        <td>{user.email}</td>

                        <td>
                          {user.department !== "All" &&
                          authUser.dept === "All" ? (
                            <select
                              className="designation-dropdown"
                              value={user.department}
                              onChange={(e) =>
                                handleDepartmentChange(user._id, e.target.value)
                              }
                            >
                              {departments.map((dept) => (
                                <option key={dept._id} value={dept.name}>
                                  {dept.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            user.department
                          )}
                        </td>

                        <td>
                          {(user.designation === "Employee" ||
                            user.designation === "IT-Person" ||
                            authUser.dept === "All") &&
                          user.department !== "All" ? (
                            <select
                              className="designation-dropdown"
                              value={user.designation}
                              onChange={(e) =>
                                handleDesignationChange(
                                  user._id,
                                  e.target.value
                                )
                              }
                            >
                              {authUser.dept == "All" && (
                                <option value="HR">HR</option>
                              )}
                              <option value="Employee">Employee</option>
                              <option value="IT-Person">IT-Person</option>
                            </select>
                          ) : (
                            user.designation
                          )}
                        </td>

                        <td>
                          <NavLink to="/dashboard/users/user_detail">
                            <button
                              className="icon-button view"
                              onClick={() => viewUser(user._id)}
                            >
                              <i className="fa fa-eye" aria-hidden="true"></i>
                            </button>
                          </NavLink>
                          <button
                            className="icon-button delete"
                            onClick={() => deleteUser(user._id)}
                          >
                            <i className="fa fa-trash" aria-hidden="true"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No users found
                    </td>
                  </tr>
                ))}
              {authUser.role === "IT-Person" &&
                (filteredUsers.length > 0 ? (
                  filteredUsers
                    .filter((user) =>
                      authUser.dept === "All"
                        ? true
                        : user.department === "All" ||
                          user.department === authUser.dept
                    )
                    .filter((user) => authUser.id !== user._id)
                    .map((user, index) => (
                      <tr
                        key={user._id}
                        style={{
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        <td>{index + 1}</td>
                        <td
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "20px",
                          }}
                        >
                          <img
                            src={`https://avatar.iran.liara.run/public/boy?${user.name}`}
                            style={{
                              boxShadow: "0px 0px 3px gray",
                              width: "45px",
                              height: "45px",
                              objectFit: "cover",
                              borderRadius: "30px",
                            }}
                            alt=""
                          />
                          <span>{user.name}</span>
                        </td>
                        <td>{user.email}</td>

                        <td>{user.department}</td>

                        <td>{user.designation}</td>

                        <td>
                          <NavLink to="/dashboard/users/user_detail">
                            <button
                              className="icon-button view"
                              onClick={() => viewUser(user._id)}
                            >
                              <i className="fa fa-eye" aria-hidden="true"></i>
                            </button>
                          </NavLink>
                          <button
                            className="icon-button delete"
                            onClick={() => deleteUser(user._id)}
                          >
                            <i className="fa fa-trash" aria-hidden="true"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No users found
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
