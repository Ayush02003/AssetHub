import { useState } from "react";
import "../../css/add_asset.css";
import use_addDepartment from "../../hooks/UseAddDepartment.js";

const Add_dept = () => {
  const [departmentName, setDepartmentName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");
  const { loading, add_dept } = use_addDepartment();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await add_dept(departmentName, description);

    setDepartmentName("");
    setDescription("");
    setStatus("Active");
  };

  return (
    <div>
      <div className="asset_main">
        <h2>ADD DEPARTMENT</h2>
        <div className="asset_form">
          <div className="asset-upper-part">
            <h4>Department Information</h4>
          </div>
          <div className="asset-lower-part">
            <form onSubmit={handleSubmit}>
              <table>
                <tr>
                  <td>
                    <label>Department Name</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="fa-solid fa-building"></i>
                    <input
                      required
                      type="text"
                      placeholder="e.g., Human Resources, Marketing, IT"
                      value={departmentName}
                      onChange={(e) => setDepartmentName(e.target.value)}
                    />
                  </td>
                </tr>

                <tr>
                  <td>
                    <label>Description</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="fa-solid fa-file-alt"></i>
                    <input
                      required
                      type="text"
                      placeholder="Briefly describe the department's purpose and functions"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Status</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i
                      className={`fa-solid ${
                        status === "Active"
                          ? "fa-circle-check"
                          : "fa-circle-xmark"
                      }`}
                    ></i>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td className="button">
                    <button className="submit" type="submit" disabled={loading}>
                      {loading ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        "Add Department"
                      )}
                    </button>
                    <input
                      className="reset"
                      type="reset"
                      value="Cancel"
                      onClick={() => {
                        setDepartmentName("");
                        setDescription("");
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

export default Add_dept;
