import { useEffect, useState } from "react";
import "../../css/users.css";
// import useAssetStore from "../../zustand/useAssetStore.js";
import { NavLink } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
const Asset_type = () => {
  //   const { assets, fetchAssets, deleteAsset, viewAsset } = useAssetStore();
  const getDefaultImage = (type) => {
    const defaultImages = {
      laptop: "https://img.icons8.com/color/96/laptop--v1.png",
      monitor: "https://img.icons8.com/color/96/monitor--v1.png",
      mobile: "https://img.icons8.com/color/96/smartphone--v1.png",
      printer: "https://img.icons8.com/color/96/print.png",
      scanner: "https://img.icons8.com/color/96/scanner.png",
      other: "https://img.icons8.com/color/96/electronics.png",
    };

    return defaultImages[type.toLowerCase()] || defaultImages["other"];
  };

  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [asset_types, setassetType] = useState([]);
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
  const filteredAssetTypes = asset_types.filter((asset_type) => {
    return (
      (filterType ? asset_type.type === filterType : true) &&
      (filterStatus ? asset_type.status === filterStatus : true)
    );
  });
  const handleStatusChange = async (assetId, status) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to change the Asset Status?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, change department!",
      cancelButtonText: "No, cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put("http://localhost:8000/api/company/update_assetType", {
            assetId,
            status,
          });
          toast.success("Status Changed Successfully!");
          const res = await axios.get("/api/company/get_assetType");
          setassetType(res.data.assetTypes);
        } catch (error) {
          toast.error("Failed to update Status" + error.message);
        }
      }
    });
  };
  return (
    <div className="user-main">
      <div className="upper-component">
        <h2>Asset Type Management</h2>
        <hr />
        <div className="filter-container">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            {asset_types.map((asset_type) => (
              <option key={asset_type._id} value={asset_type.type}>
                {asset_type.type}
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
                <td style={{ width: "20%" }}>Type</td>
                <td style={{ width: "40%" }}>Description</td>
                <td style={{ width: "20%" }}>Status</td>
                <td style={{ width: "10%" }}>Action</td>
              </tr>
            </thead>

            <tbody>
              {filteredAssetTypes.length > 0 ? (
                filteredAssetTypes.map((asset, index) => (
                  <tr
                    key={asset._id}
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
                        src={asset.pic1 || getDefaultImage(asset.type)}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "contain",
                        }}
                        alt={asset.type}
                      />

                      <span>{asset.type}</span>
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
                        {asset.description}
                      </div>
                    </td>

                    <td>
                      <select
                        className="designation-dropdown"
                        value={asset.status}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          handleStatusChange(asset._id, selectedValue);
                        }}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </td>

                    <td>
                      <NavLink to="/dashboard/total_asset/asset_detail">
                        {/* <button
                          className="icon-button view"
                          onClick={() => viewAsset(asset)}
                        >
                          <i className="fa fa-eye" aria-hidden="true"></i>
                        </button> */}
                      </NavLink>
                      <button
                        className="icon-button delete"
                        // onClick={() => deleteAsset(asset._id)}
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No Asset Type found
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

export default Asset_type;
