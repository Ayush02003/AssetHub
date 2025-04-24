import { useState, useEffect } from "react";
import "../../css/add_asset.css";
import use_addAssetReturn from "../../hooks/UseAssetReturn";
import useAssetStore from "../../zustand/useAssetStore.js";
import { useAuthContext } from "../../context/AuthContext.jsx";

// import toast from "react-hot-toast";
const Asset_return = () => {
  const { assets, fetchUserAssets } = useAssetStore();
  const [condition, setCondition] = useState("");

  const { authUser } = useAuthContext();

  useEffect(() => {
    fetchUserAssets(authUser.id);
  }, []);
  const [assignedLaptopId, setAssignedLaptopId] = useState("");
  const [return_reason, setReturnReason] = useState("");
  const [assetType, setAssetType] = useState("");
  const { loading, assetReturn } = use_addAssetReturn();
  //   const today = new Date().toISOString().split("T")[0];
  const handleSubmit = async (e) => {
    e.preventDefault();

    await assetReturn(assignedLaptopId, condition, return_reason);
    
    setCondition("");
    setAssignedLaptopId("");
    setReturnReason("");
    setAssetType("");
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
      <h2>Asset Return Form</h2>
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
                          .filter(
                            (asset) =>
                              asset.type === assetType &&
                              asset.status !== "Asset Lost"
                          )
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
                    <label>Condition of Asset</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <textarea
                      required
                      placeholder="Describe any wear, damage, or missing parts (if any)"
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      rows={2}
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
                    <span>
                      <label>Asset Return Reason</label>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <textarea
                      required
                      placeholder="Explain why you are returning the asset (e.g., no longer needed, replacement received, end of project, etc.)"
                      value={return_reason}
                      onChange={(e) => setReturnReason(e.target.value)}
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
                        setReturnReason("");
                        setAssetType("");
                        setCondition("");
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

export default Asset_return;
