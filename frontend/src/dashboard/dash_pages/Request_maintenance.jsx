import { useState, useEffect } from "react";
import "../../css/add_asset.css";
import use_addAssetHelp from "../../hooks/UseAddAssetHelp";
import useAssetStore from "../../zustand/useAssetStore.js";

import { useAuthContext } from "../../context/AuthContext.jsx";
// import toast from "react-hot-toast";
const Request_issue_form = () => {
  const { assets, fetchUserAssets } = useAssetStore();
  const { authUser } = useAuthContext();

  useEffect(() => {
    fetchUserAssets(authUser.id);
  }, []);
  const [file, setFile] = useState(null);
  const [lost_date, setLostDate] = useState(null);
  const [type, setType] = useState("");
  const [assignedLaptopId, setAssignedLaptopId] = useState("");
  const [description, setDescription] = useState("");
  const [assetType, setAssetType] = useState("");
  const { loading, requestAssetIssue } = use_addAssetHelp();
  const today = new Date().toISOString().split("T")[0];
  const [previewPic1, setPreviewPic1] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();

    await requestAssetIssue(assignedLaptopId, type, file, lost_date, description);

    setAssignedLaptopId("");
    setFile(null);
    setType("");
    setLostDate("");
    setDescription("");
    setAssetType("");
    setPreviewPic1(null);
  };
  const handleFileChange = (e, setFile,setPreview) => {
    const file = e.target.files[0];
      setFile(file); 
      setPreview(URL.createObjectURL(file));
  };
  return (
    <div className="asset_main">
      <style>
        {`
            select {
              width: 100%;
              background-color: #F0F4FA;
              padding: 8px 10px 8px 50px;
              appearance: none;
              border-radius: 5px;
              cursor: pointer;
            }
          `}
      </style>
      <h2>Request Issue Form</h2>
      <div className="asset_form">
        <div className="asset-upper-part">
          <h4>Asset Information</h4>
        </div>
        <div className="asset-lower-part">
          <form onSubmit={handleSubmit}>
            <table>
              <tbody>
                <tr>
                  <td>
                    <label>Asset Help Type</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i
                      className={`fa ${
                        type === "maintenance"
                          ? "fa-wrench"
                          : "fa-exclamation-triangle"
                      }`}
                    ></i>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="maintenance">Request Maintenance</option>
                      <option value="lost">Report Lost</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Select Your Asset Type</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="fa fa-box-open"></i>
                    <select
                      value={assetType}
                      onChange={(e) => setAssetType(e.target.value)}
                      required
                    >
                      <option value="" style={{ color: "#9ea3ae" }}>
                        Select Asset Type
                      </option>
                      {assets.length > 0 ? (
                        [...new Set(assets.map((asset) => asset.type))].map(
                          (uniqueAsset, index) => (
                            <option key={index} value={uniqueAsset}>
                              {uniqueAsset}
                            </option>
                          )
                        )
                      ) : (
                        <option disabled>No Assets found</option>
                      )}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Select Your {assetType ? assetType : "Asset"}</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="fa fa-laptop"></i>
                    <select
                      value={assignedLaptopId}
                      onChange={(e) => setAssignedLaptopId(e.target.value)}
                      required
                    >
                      <option value="" style={{ color: "#9ea3ae" }}>
                        Select {assetType ? assetType : "Asset"}
                      </option>
                      {assets.length > 0 ? (
                        assets
                          .filter((asset) => (asset.type === assetType && asset.status !== "Asset Lost"))
                          .map((asset) => (
                            <option key={asset._id} value={asset._id}>
                              {asset.name}
                            </option>
                          ))
                      ) : (
                        <option disabled>No Assets found</option>
                      )}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Serial num</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="fa-solid fa-box-open"></i>
                    <input
                      required
                      type="text"
                      style={{ letterSpacing: "1px" }}
                      placeholder="Serial Number"
                      value={
                        assignedLaptopId
                          ? assets.find(
                              (asset) => asset._id === assignedLaptopId
                            )?.serial_num || ""
                          : ""
                      }
                      readOnly
                    />
                  </td>
                </tr>
                {type === "lost" && (
                  <>
                    <tr>
                      <td>
                        <label>Lost Date</label>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <i className="fa fa-calendar-alt"></i>
                        <input
                          type="date"
                          value={lost_date}
                          max={today}
                          onChange={(e) => setLostDate(e.target.value)}
                          required
                        />
                      </td>
                    </tr>
                  </>
                )}

                <tr>
                  <td>
                    <label>
                      {type === "lost"
                        ? "Explain how asset was lost"
                        : type === "maintenance"
                        ? "Describe the issue"
                        : "Description"}
                    </label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <textarea
                      required
                      placeholder={
                        type === "lost"
                          ? "Describe the circumstances of the loss"
                          : "Provide detailed information about the maintenance issue"
                      }
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      style={{
                        resize: "none",
                        backgroundColor: "#F0F4FA",
                        width: "100%",
                        padding: "8px",
                        borderRadius: "5px",
                      }}
                    ></textarea>
                  </td>
                </tr>

                <tr>
                  <td>
                    <label htmlFor="">Supporting Document</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i
                      style={{ fontSize: "22px" }}
                      className="fa-regular fa-image"
                    ></i>
                    <input
                      type="file"
                      name="pic1"
                      id="pic1Input"
                      accept="image/png, image/jpg, image/jpeg"
                      onChange={(e) => handleFileChange(e, setFile, setPreviewPic1)}
                    />
                     {previewPic1 && (
                      <img src={previewPic1} alt="Preview 1" width="100" />
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="button">
                    <button className="submit" type="submit" disabled={loading}>
                      {loading ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        "Submit"
                      )}
                    </button>
                    <input
                      className="reset"
                      type="reset"
                      value="Cancel"
                      onClick={() => {
                        setAssignedLaptopId("");
                        setType("");
                        setDescription("");
                        setAssetType("");
                        setFile(null);  
                        setPreviewPic1(null);
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Request_issue_form;
