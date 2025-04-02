import { useState, useEffect } from "react";
import "../../css/add_asset.css";
import use_addSoftware from "../../hooks/UseAddSoftware.js";
import useAssetStore from "../../zustand/useAssetStore.js";
import toast from "react-hot-toast";

const AddSoftware = () => {
  const { assets, fetchAssets } = useAssetStore();

  useEffect(() => {
    fetchAssets();
  }, []);

  const [installationType, setInstallationType] = useState("");
  const [assignedLaptopId, setAssignedLaptopId] = useState("");
  const [name, setName] = useState("");
  const [version, setVersion] = useState("");
  const [licenseType, setLicenseType] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  const [assetType, setAssetType] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  const { loading, add_software } = use_addSoftware();

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      (licenseType === "Paid" || licenseType === "Trial") &&
      (!licenseKey || !expirationDate)
    ) {
      toast.error(
        `License Key and Expiration Date are required for ${licenseType} licenses.`
      );
      return;
    }
    await add_software(
      installationType,
      assignedLaptopId,
      name,
      version,
      licenseType,
      licenseKey,
      expirationDate
    );

    // Reset Form
    setInstallationType("");
    setAssignedLaptopId("");
    setName("");
    setVersion("");
    setLicenseType("");
    setAssetType("");
    setLicenseKey("");
    setExpirationDate("");
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
      <h2>ADD SOFTWARE</h2>
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
                    <label>Installation Type</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="fa-solid fa-download"></i>
                    <select
                      value={installationType}
                      onChange={(e) => setInstallationType(e.target.value)}
                      required
                    >
                      <option value="" style={{ color: "#9ea3ae" }}>
                        Select License Type
                      </option>
                      <option value="Pre-Installed">Pre-Installed</option>
                      <option value="Installed on Request">
                        Installed on Request
                      </option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Select Asset Type</label>
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
                    <label>Select {assetType ? assetType : "Asset"}</label>
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
                    <label>License Type</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="fa-solid fa-file-contract"></i>
                    <select
                      value={licenseType}
                      onChange={(e) => setLicenseType(e.target.value)}
                      required
                    >
                      <option style={{ color: "#9ea3ae" }} value="">
                        Select License Type
                      </option>
                      <option value="Free">Free</option>
                      <option value="Paid">Paid</option>
                      <option value="Trial">Trial</option>
                    </select>
                  </td>
                </tr>

                <tr>
                  <td>
                    <label>License Key</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="fa-solid fa-key"></i>
                    <input
                      type="text"
                      style={{ letterSpacing: "2px" }}
                      placeholder="Enter License Key"
                      value={licenseKey}
                      onChange={(e) => setLicenseKey(e.target.value)}
                    />
                  </td>
                </tr>

                <tr>
                  <td>
                    <label>Software Expiration Date</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="fa-solid fa-hourglass-start"></i>
                    <input
                      min={today}
                      type="date"
                      value={expirationDate}
                      onChange={(e) => setExpirationDate(e.target.value)}
                    />
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
                        setInstallationType("");
                        setAssignedLaptopId("");
                        setName("");
                        setVersion("");
                        setLicenseType("");
                        setLicenseKey("");
                        setExpirationDate("");
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

export default AddSoftware;
