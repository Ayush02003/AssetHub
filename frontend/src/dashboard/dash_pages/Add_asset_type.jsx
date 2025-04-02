import { useState } from "react";
import "../../css/add_asset.css";
import use_addAssetType from "../../hooks/UseAddAssetType.js"; 

const Add_asset_type = () => {
  const [assetType, setassetType] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");
  const { loading, add_asset_type } = use_addAssetType();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await add_asset_type(assetType, description, status); 
    setassetType("");
    setDescription("");
    setStatus("Active");
  };

  return (
    <div>
      <div className="asset_main">
        <h2>ADD ASSET TYPE</h2>
        <div className="asset_form">
          <div className="asset-upper-part">
            <h4>Asset Type Information</h4>
          </div>
          <div className="asset-lower-part">
            <form onSubmit={handleSubmit}>
              <table>
                <tr>
                  <td><label>Asset Type</label></td>
                </tr>
                <tr>
                  <td>
                    <i className="fa-solid fa-box"></i>
                    <input
                      required
                      type="text"
                      placeholder="e.g., Laptop, Printer, Monitor"
                      value={assetType}
                      onChange={(e) => setassetType(e.target.value)}
                    />
                  </td>
                </tr>

                <tr>
                  <td><label>Description</label></td>
                </tr>
                <tr>
                  <td>
                    <i className="fa-solid fa-file-alt"></i>
                    <input
                      required
                      type="text"
                      placeholder="Briefly describe Asset Type"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </td>
                </tr>

                <tr>
                  <td><label>Status</label></td>
                </tr>
                <tr>
                  <td>
                    <i className={`fa-solid ${status === "Active" ? "fa-circle-check" : "fa-circle-xmark"}`}></i>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
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
                        "Add Asset Type"
                      )}
                    </button>
                    <input
                      className="reset"
                      type="reset"
                      value="Cancel"
                      onClick={() => {
                        setassetType("");
                        setStatus("Active")
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

export default Add_asset_type;
