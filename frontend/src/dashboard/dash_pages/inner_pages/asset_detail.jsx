import { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import useUserStore from "../../../zustand/useUserStore.js";
import useAssetStore from "../../../zustand/useAssetStore.js";
import "../../../css/asset_detail.css";
import toast from "react-hot-toast";
import axios from "axios";
const Asset_detail = () => {
  const { selectedUser, allocatedAssetUserByAssetId } = useUserStore();
  const {
    selectedAsset,
    updateAsset,
    fetchInstalledSoftware,
    installedSoftware,
    updateSoftware,
    viewAsset,
  } = useAssetStore();
  const navigate = useNavigate();

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const assetId = queryParams.get("id");
  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const res = await axios.get(
          `/api/asset/get_asset_by_id?asset_id=${assetId}`
        );
        viewAsset(res.data.asset);
        fetchInstalledSoftware(assetId);
      } catch (e) {
        toast.error("Failed to fetch asset details." + e);
      }
    };

    if (assetId) {
      fetchAsset();
    }
  }, [assetId]);

  const [assetData, setAssetData] = useState({
    id: "",
    name: "",
    brand: "",
    price: "",
    desc: "",
    serial_num: "",
    purchase_date: "",
    warranty_exp: "",
  });
  const [softwareData, setSoftwareData] = useState({
    id: "",
    name: "",
    license_type: "",
    license_key: "",
    installation_type: "",
    version: "",
    expiration_date: "",
  });
  const [selectedSoftware, setSelectedSoftware] = useState(false);
  useEffect(() => {
    if (selectedAsset) {
      fetchInstalledSoftware(selectedAsset._id);
      setAssetData({
        id: selectedAsset._id || "",
        name: selectedAsset.name || "",
        brand: selectedAsset.brand || "",
        serial_num: selectedAsset.serial_num || "",
        price: selectedAsset.price || "",
        desc: selectedAsset.desc || "",
        purchase_date: selectedAsset.purchase_date
          ? new Date(selectedAsset.purchase_date).toISOString().split("T")[0]
          : "",
        warranty_exp: selectedAsset.warranty_exp
          ? new Date(selectedAsset.warranty_exp).toISOString().split("T")[0]
          : "",
      });
    }
  }, [selectedAsset]);

  useEffect(() => {
    if (selectedSoftware) {
      setSoftwareData({
        id: selectedSoftware._id || "",
        name: selectedSoftware.name || "",
        license_type: selectedSoftware.license_type || "",
        installation_type: selectedSoftware.installation_type || "",
        version: selectedSoftware.version || "",
        license_key: selectedSoftware.license_key || "",
        expiration_date: selectedSoftware.expiration_date
          ? new Date(selectedSoftware.expiration_date)
              .toISOString()
              .split("T")[0]
          : "",
      });
    }
  }, [selectedSoftware]);

  const handleChange = (e) => {
    setAssetData({ ...assetData, [e.target.name]: e.target.value });
  };
  const handleSoftwareChange = (e) => {
    setSoftwareData({ ...softwareData, [e.target.name]: e.target.value });
  };
  const handleSoftwareClick = (software) => {
    setSelectedSoftware(software);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    if (
      !assetData.name ||
      !assetData.brand ||
      !assetData.price ||
      !assetData.desc ||
      !assetData.serial_num ||
      !assetData.purchase_date ||
      !assetData.warranty_exp
    ) {
      toast.error("Please fill all fields.");
      return;
    }
    await updateAsset(assetData);
  };
  const today = new Date().toISOString().split("T")[0];
  const handleSoftwareSave = async (e) => {
    e.preventDefault();
    if (
      (softwareData.license_type === "Paid" ||
        softwareData.license_type === "Trial") &&
      (!softwareData.license_key || !softwareData.expiration_date)
    ) {
      toast.error(
        `License Key and Expiration Date are required for ${softwareData.license_type} licenses.`
      );
      return;
    }
    await updateSoftware(softwareData);
    // toast.success("Software updated successfully!");
  };

  useEffect(() => {
    if (!selectedAsset) {
      navigate(-1);
      return;
    }

    const fetchUserAssets = async () => {
      if (!selectedAsset || !selectedAsset._id) return;
      await allocatedAssetUserByAssetId(selectedAsset._id);
    };

    fetchUserAssets();
  }, [selectedAsset, navigate]);

  if (!selectedAsset) {
    return <p>Loading asset details...</p>;
  }
  return (
    <div className="main-noti-detail">
      <div className="title-container">
        <i onClick={() => navigate(-1)} className="fa fa-arrow-left"></i>
        <p>
          <span>Asset Detail</span>
        </p>
      </div>
      <hr />
      <div className="asset-detail">
        <img
          src={selectedAsset?.pic1 || "fallback-image1.jpg"}
          alt="Asset Image 1"
          style={{
            height: "70px",
            width: "80px",
            objectFit: "contain",
            borderRadius: "0px",
            marginRight: "20px",
            marginLeft: "20px",
            boxShadow: "none",
          }}
        />
        <img
          src={selectedAsset?.pic2 || "fallback-image2.jpg"}
          alt="Asset Image 2"
          style={{
            height: "70px",
            width: "80px",
            objectFit: "contain",
            borderRadius: "0px",
            boxShadow: "none",
          }}
        />
        <div className="user-info">
          <p>{selectedAsset?.name || "N/A"}</p>
          <p>{selectedAsset?.type || "N/A"}</p>
        </div>
      </div>

      <div className="available-laptop">
        {selectedUser ? (
          <p>
            <i className="fa fa-laptop"></i> Asset Allocated
          </p>
        ) : (
          <p>
            <i className="fa fa-laptop"></i> Asset Not Allocated
          </p>
        )}
        {/* <hr /> */}

        {selectedUser && (
          <NavLink to="/dashboard/users/user_detail" key={selectedUser._id}>
            <div className="laptop-data">
              <img
                style={{
                  width: "45px",
                  height: "45px",
                  borderRadius: "50%",
                  objectFit: "contain",
                  border: "2px solid #ddd",
                }}
                src={`https://avatar.iran.liara.run/public/boy`}
                alt="User Avatar"
              />
              <input
                type="text"
                readOnly
                value={selectedUser?.name || "N/A"}
                placeholder="Name"
              />
              <input
                type="text"
                readOnly
                value={selectedUser?.email || "N/A"}
                placeholder="Email"
              />
              <input
                type="text"
                readOnly
                value={selectedUser?.designation || "N/A"}
                placeholder="Designation"
              />
            </div>
          </NavLink>
        )}
      </div>

      <div className="asset-software-detail">
        <div className="asset-data">
          <table>
            <tbody>
              <tr>
                <td>Name:</td>
                <td>
                  <input
                    required
                    type="text"
                    name="name"
                    value={assetData.name}
                    placeholder="Name"
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>Brand:</td>
                <td>
                  <input
                    required
                    type="text"
                    name="brand"
                    value={assetData.brand}
                    placeholder="Brand"
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>Price:</td>
                <td>
                  <input
                    required
                    type="text"
                    name="price"
                    value={assetData.price}
                    placeholder="Price"
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>Specification:</td>
                <td>
                  <input
                    required
                    type="text"
                    name="desc"
                    value={assetData.desc}
                    placeholder="Specification"
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>Serial num:</td>
                <td>
                  <input
                    required
                    type="text"
                    name="serial_num"
                    value={assetData.serial_num || ""}
                    placeholder="Serial Number"
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>Purchase Date:</td>
                <td>
                  <input
                    required
                    type="date"
                    name="purchase_date"
                    value={assetData.purchase_date}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>Warranty Expiry:</td>
                <td>
                  <input
                    required
                    type="date"
                    name="warranty_exp"
                    min={assetData.purchase_date}
                    value={assetData.warranty_exp}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>Installed Software:</td>
                <td>
                  {installedSoftware.length > 0 ? (
                    <div className="software-bubbles">
                      {installedSoftware.map((software, index) => {
                        const isExpired =
                          software.expiration_date &&
                          new Date(software.expiration_date) < new Date();

                        return (
                          <span
                            key={index}
                            onClick={() => handleSoftwareClick(software)}
                            className={`software-bubble ${
                              isExpired ? "expired" : ""
                            }`}
                          >
                            {software.name}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="no-software">No Software Installed</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {selectedSoftware && (
          <div className="software-data">
            <div className="software-detail">
              <p>Software Detail</p>
              <table>
                <tr>
                  <td>Name:</td>
                  <td>
                    <input
                      required
                      type="text"
                      name="name"
                      value={softwareData.name}
                      placeholder="Specification"
                      onChange={handleSoftwareChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>License Type:</td>
                  <td>
                    <select
                      name="license_type"
                      value={softwareData.license_type}
                      onChange={handleSoftwareChange}
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
                  <td>License Key:</td>
                  <td>
                    <input
                      required
                      type="text"
                      name="license_key"
                      value={softwareData.license_key}
                      placeholder="Specification"
                      onChange={handleSoftwareChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Version:</td>
                  <td>
                    <input
                      required
                      type="text"
                      name="version"
                      value={softwareData.version}
                      placeholder="Specification"
                      onChange={handleSoftwareChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Expiration Date:</td>
                  <td>
                    <input
                      required
                      type="date"
                      name="expiration_date"
                      value={softwareData.expiration_date}
                      placeholder="Specification"
                      min={today}
                      onChange={handleSoftwareChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Installed Type:</td>
                  <td>
                    <select
                      name="installation_type"
                      value={softwareData.installation_type}
                      onChange={handleSoftwareChange}
                      required
                    >
                      <option value="" style={{ color: "#9ea3ae" }}>
                        Select Installation Type
                      </option>
                      <option value="Pre-Installed">Pre-Installed</option>
                      <option value="Installed on Request">
                        Installed on Request
                      </option>
                    </select>
                  </td>
                </tr>
              </table>
            </div>
            <div className="action-buttons">
              <button
                className="approve-btn"
                style={{
                  width: "100%",
                  padding: "9px 10px",
                  background: "linear-gradient(135deg, #00bcd4, #0097a7)",
                }}
                onClick={handleSoftwareSave}
              >
                Update Software Detail
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="action-buttons">
        <button
          className="approve-btn"
          style={{ width: "55%" }}
          onClick={handleSave}
        >
          Update Asset Detail
        </button>
      </div>
    </div>
  );
};

export default Asset_detail;
