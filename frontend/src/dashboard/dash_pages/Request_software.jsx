import { useState, useEffect } from "react";
import "../../css/add_asset.css";
import use_addRequestSoftware from "../../hooks/UseAddRequestSoftware.js";
import useAssetStore from "../../zustand/useAssetStore.js";
// import toast from "react-hot-toast";

import { useAuthContext } from "../../context/AuthContext.jsx";
const Request_software = () => {
    const { assets, fetchUserAssets } = useAssetStore();
    const { authUser } = useAuthContext();

    useEffect(() => {
    fetchUserAssets(authUser.id);
  }, []);

  const [assignedLaptopId, setAssignedLaptopId] = useState("");
  const [name, setName] = useState("");
  const [version, setVersion] = useState("");
  const [assetType, setAssetType] = useState("");
  const [software_purpose, setSoftware_purpose] = useState("");
  const [expected_duration, setExpected_duration] = useState("");
  const { loading, request_software } = use_addRequestSoftware();


  const handleSubmit = async (e) => {
    e.preventDefault();

    await request_software(
      assignedLaptopId,
      name,
      version,
      software_purpose,
      expected_duration,
    );

    setAssignedLaptopId("");
    setName("");
    setVersion("");
    setSoftware_purpose("")
    setAssetType("")
    setExpected_duration("");
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
      <h2>REQUEST SOFTWARE</h2>
      <div className="asset_form">
        <div className="asset-upper-part">
          <h4>Software Information</h4>
        </div>
        <div className="asset-lower-part">
          <form onSubmit={handleSubmit}>
            <table>
              <tbody>
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
                          .filter((asset) => asset.type === assetType)
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
                <tr>
                  <td>
                    <label>Software Name</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="fa-solid fa-box-open"></i>
                    <input
                      required
                      type="text"
                      placeholder="Enter Software Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Software Purpose</label>
                  </td>
                </tr>
                <tr>
                  <td>
                  <i className="fa-solid fa-lightbulb"></i>

                    <input
                      required
                      type="text"
                      placeholder="Enter Software Purpose"
                      value={software_purpose}
                      onChange={(e) => setSoftware_purpose(e.target.value)}
                    />
                  </td>
                </tr>      
                <tr>
                  <td>
                    <label>Software Version</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="fa-solid fa-code-branch"></i>
                    <input
                      required
                      type="text"
                      placeholder="Enter Software Version"
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                    />
                  </td>
                </tr>

                <tr>
                  <td>
                    <label>Expected Duration</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="fa-solid fa-file-contract"></i>
                    <select
                      value={expected_duration}
                      onChange={(e) => setExpected_duration(e.target.value)}
                      required
                    >
                      <option style={{ color: "#9ea3ae" }} value="">
                        Select Expected Duration
                      </option>
                      <option value="6 Month">6 Month</option>
                      <option value="1 Year">1 Year</option>
                      <option value="More Than 1 Year">More Than 1 Year</option>
                    </select>
                  </td>
                </tr>


              

                <tr>
                  <td className="button">
                    <button className="submit" type="submit" disabled={loading}>
                      {loading ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        "Add Software"
                      )}
                    </button>
                    <input
                      className="reset"
                      type="reset"
                      value="Cancel"
                      onClick={() => {
                        setAssignedLaptopId("");
                        setName("");
                        setVersion("");
                        setSoftware_purpose("")
                        setAssetType("")
                        setExpected_duration("");
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

export default Request_software;
