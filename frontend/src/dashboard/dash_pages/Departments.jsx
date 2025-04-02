import { useEffect, useState } from "react";
import "../../css/users.css";
// import useAssetStore from "../../zustand/useAssetStore.js";
import { NavLink } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
const Departments = () => {
  //   const { assets, fetchAssets, deleteAsset, viewAsset } = useAssetStore();
  const getDefaultImage = (name) => {
    const defaultImages = {
      finance: "https://img.icons8.com/color/96/money-bag-euro.png",
      marketing: "https://cdn-icons-png.flaticon.com/128/2821/2821744.png",
      "human resource": "https://img.icons8.com/color/96/conference.png",
      other: "https://img.icons8.com/color/96/settings.png",
    };

    return defaultImages[name.toLowerCase()] || defaultImages["other"];
  };

  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

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

  const filteredAssetTypes = departments.filter((dept) => {
    return (
      (filterName ? dept.name === filterName : true) &&
      (filterStatus ? dept.status === filterStatus : true)
    );
  });
  const handleStatusChange = async (deptId, status) => {
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
          await axios.put("http://localhost:8000/api/company/update_dept", {
            deptId,
            status,
          });
          toast.success("Status Changed successfully!");
          const res = await axios.get("/api/company/get_dept");
          setDepartments(res.data.dept);
        } catch (error) {
          toast.error("Failed to update Status " + error.message);
        }
      }
    });
  };
  return (
    <div className="user-main">
      <div className="upper-component">
        <h2>Department Management</h2>
        <hr />
        <div className="filter-container">
          <select
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          >
            <option value="">All Types</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <hr />
            <option value="Active">Active</option>
            <option value="Inactive">InActive</option>
          </select>
        </div>
      </div>

      <div className="lower-component">
        <div className="inner-component">
          <table style={{ width: "100%", tableLayout: "fixed" }}>
            <thead>
              <tr id="title">
                <td style={{ width: "10%" }}>Sr No.</td>
                <td style={{ width: "20%" }}>Name</td>
                <td style={{ width: "40%" }}>Description</td>
                <td style={{ width: "20%" }}>Status</td>
                <td style={{ width: "10%" }}>Action</td>
              </tr>
            </thead>

            <tbody>
              {filteredAssetTypes.length > 0 ? (
                filteredAssetTypes.map((dept, index) => (
                  <tr
                    key={dept._id}
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
                        src={dept.pic1 || getDefaultImage(dept.name)}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "contain",
                        }}
                        alt={dept.name}
                      />

                      <span>{dept.name}</span>
                    </td>

                    <td>
                      <div
                        style={{
                          display: "block",
                          overflowY: "auto",
                          overflowX: "hidden",
                          maxHeight: "2.6em",
                          //   whiteSpace: "normal",
                          lineHeight: "1.4em",
                          WebkitMaskImage:
                            "linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0))",
                          scrollbarWidth: "thin",
                          //   scrollbarColor: "transparent transparent",
                        }}
                      >
                        {dept.desc}
                      </div>
                    </td>

                    <td>
                      <select
                        className="designation-dropdown"
                        value={dept.status}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          handleStatusChange(dept._id, selectedValue);
                        }}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">InActive</option>
                      </select>
                    </td>

                    <td>
                      <NavLink to="/dashboard/total_asset/asset_detail">
                        {/* <button
                          className="icon-button view"
                          onClick={() => viewAsset(dept)}
                        >
                          <i className="fa fa-eye" aria-hidden="true"></i>
                        </button> */}
                      </NavLink>
                      <button
                        className="icon-button delete"
                        // onClick={() => deleteAsset(dept._id)}
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No Department found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Departments;
