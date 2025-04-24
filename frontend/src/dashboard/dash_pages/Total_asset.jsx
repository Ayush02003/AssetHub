import { useEffect, useState } from "react";
import "../../css/users.css";
import useAssetStore from "../../zustand/useAssetStore.js";
import { NavLink } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
const Total_asset = () => {
  const { assets, fetchAssets, deleteAsset, viewAsset } = useAssetStore();

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
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
  useEffect(() => {
    fetchAssets();
  }, []);

  const filteredAssets = assets.filter((asset) => {
    return (
      asset.name.toLowerCase().includes(search.toLowerCase()) &&
      (filterType ? asset.type === filterType : true) &&
      (filterStatus ? asset.status === filterStatus : true) &&
      (filterBrand ? asset.brand === filterBrand : true)
    );
  });

  return (
    <div className="user-main">
      <div className="upper-component">
        <h2>Asset Management</h2>
        <hr />
        <div className="filter-container">
          <div>
          <input
            type="text"
            placeholder="Search by Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
           <i className="fa fa-laptop"></i>
          </div>
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
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
          >
            <option value="">All Brands</option>
            <hr />
            {[...new Set(assets.map((asset) => asset.brand))].map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <hr />
            {[...new Set(assets.map((asset) => asset.status))].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="lower-component">
        <div className="inner-component">
          <table style={{ width: "100%", tableLayout: "fixed" }}>
            <thead>
              <tr id="title">
                <td style={{ width: "15%" }}>Sr No.</td>
                <td style={{ width: "35%" }}>Name</td>
                <td style={{ width: "15%" }}>Type</td>
                <td style={{ width: "15%" }}>Brand</td>
                <td style={{ width: "20%" }}>Status</td>
                <td style={{ width: "20%" }}>Action</td>
              </tr>
            </thead>

            <tbody>
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset, index) => (
                  <tr
                    key={asset._id}
                    style={{
                      borderBottom:"1px solid #ddd",
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
                        src={asset.pic1}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "contain",
                        }}
                        alt=""
                      />
                      <span>{asset.name}</span>
                    </td>

                    <td>{asset.type}</td>
                    <td>{asset.brand}</td>
                    <td>
                      <span
                        className={`status ${asset.status
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {asset.status}
                      </span>
                    </td>

                    <td>
                      <NavLink to="/dashboard/total_asset/asset_detail">
                        <button
                          className="icon-button view"
                          onClick={() => viewAsset(asset)}
                        >
                          <i className="fa fa-eye" aria-hidden="true"></i>
                        </button>
                      </NavLink>
                      <button
                        className="icon-button delete"
                        onClick={() => deleteAsset(asset._id)}
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No Assets found
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

export default Total_asset;
