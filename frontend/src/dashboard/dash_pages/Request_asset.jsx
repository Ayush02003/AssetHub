import { useState, useEffect } from "react";
import "../../css/add_asset.css";
import UseAddRequestAsset from "../../hooks/UseAddRequestAsset.js";
import axios from "axios";
import toast from "react-hot-toast";
const RequestAsset = () => {
  const [assetType, setAssetType] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [softwareRequirements, setSoftwareRequirements] = useState("");
  const [assetNeed, setAssetNeed] = useState("");
  const [expectedDuration, setExpectedDuration] = useState("");
  const [address, setAddress] = useState("");
  const [asset_types, setassetType] = useState([]);
  const { loading, add_request } = UseAddRequestAsset();
  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const res = await axios.get("/api/company/get_assetType");
        setassetType(res.data.assetTypes);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchAsset();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    await add_request(
      assetType,
      specifications,
      softwareRequirements,
      assetNeed,
      expectedDuration,
      address
    );

    setAssetType("");
    setSpecifications("");
    setSoftwareRequirements("");
    setAssetNeed("");
    setExpectedDuration("");
    setAddress("");
  };

  return (
    <div className="asset_main">
      <h2>Request Asset</h2>
      <div className="asset_form">
        <div className="asset-upper-part">
          <h4>Asset Request Form</h4>
        </div>
        <div className="asset-lower-part">
          <form onSubmit={handleSubmit}>
            <table>
              <tr>
                <td>
                  <label>Asset Type</label>
                </td>
              </tr>
              <tr>
                <td>
                  <i className="fa-solid fa-desktop"></i>
                  <select
                    required
                    name="type"
                    value={assetType}
                    onChange={(e) => setAssetType(e.target.value)}
                  >
                    <option value="" disabled>
                      Select Asset Type
                    </option>
                    {asset_types
                      .filter(
                        (asset_type) =>
                          asset_type.status.toLowerCase() != "inactive"
                      )
                      .map((asset_type) => (
                        <option key={asset_type._id} value={asset_type.type}>
                          {asset_type.type}
                        </option>
                      ))}
                  </select>
                </td>
              </tr>

              <tr>
                <td>
                  <label>Preferred Specifications</label>
                </td>
              </tr>
              <tr>
                <td>
                  <i className="fa-solid fa-microchip"></i>
                  <input
                    required
                    type="text"
                    placeholder="E.g., 16GB RAM, 512GB SSD, Intel i7"
                    value={specifications}
                    onChange={(e) => setSpecifications(e.target.value)}
                  />
                </td>
              </tr>

              <tr>
                <td>
                  <label>Software Requirements (Optional)</label>
                </td>
              </tr>
              <tr>
                <td>
                  <i className="fa-solid fa-code"></i>
                  <input
                    type="text"
                    placeholder="E.g., MS Office, AutoCAD, Photoshop"
                    value={softwareRequirements}
                    onChange={(e) => setSoftwareRequirements(e.target.value)}
                  />
                </td>
              </tr>

              <tr>
                <td>
                  <label>Reason for Asset Request</label>
                </td>
              </tr>
              <tr>
                <td>
                  <i className="fa-solid fa-question-circle"></i>
                  <input
                    type="text"
                    required
                    placeholder="Explain why you need this asset (e.g., project work, development, testing...)"
                    value={assetNeed}
                    onChange={(e) => setAssetNeed(e.target.value)}
                  />
                </td>
              </tr>

              <tr>
                <td>
                  <label>Expected Duration of Use</label>
                </td>
              </tr>
              <tr>
                <td>
                  <i className="fa-regular fa-clock" aria-hidden="true"></i>
                  <select
                    required
                    value={expectedDuration}
                    onChange={(e) => setExpectedDuration(e.target.value)}
                  >
                    <option
                      value=""
                      style={{
                        color: " #9ea3ae",
                      }}
                    >
                      Select Duration
                    </option>
                    <option value="3 months">3 months</option>
                    <option value="6 months">6 months</option>
                    <option value="1 year">1 year</option>
                    <option value="Permanent">Permanent</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td>
                  <label>Location for Asset Allocation</label>
                </td>
              </tr>
              <tr>
                <td>
                  <i className="fa-regular fa-address-card"></i>
                  <input
                    required
                    type="text"
                    placeholder="Home Address/ Office Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </td>
              </tr>

              <tr>
                <td className="button">
                  <button className="submit" type="submit" disabled={loading}>
                    {loading ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      "Submit Request"
                    )}
                  </button>
                  <input
                    className="reset"
                    type="reset"
                    value="Cancel"
                    onClick={() => {
                      setAssetType("");
                      setSpecifications("");
                      setSoftwareRequirements("");
                      setAssetNeed("");
                      setExpectedDuration("");
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
  );
};

export default RequestAsset;
