import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../../zustand/useUserStore.js";
import useAssetStore from "../../../zustand/useAssetStore.js";
import { NavLink } from "react-router-dom";
import "../../../css/user_detail.css";

const User_detail = () => {
  const { selectedUser } = useUserStore();
  const {
    fetchAssets,
    allocatedAssetUser,
    allocatedAssets,
    installedSoftwareMap,
    viewAsset
  } = useAssetStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedUser) {
      navigate(-1);
      return;
    }
    const fetchUserAssets = async () => {
      if (selectedUser?._id) {
        await allocatedAssetUser(selectedUser._id);
        fetchAssets();
      }
    };
    fetchUserAssets();
  }, [selectedUser]);

  return (
    <div className="main-noti-detail">
      <div className="title-container">
        <i onClick={() => navigate(-1)} className="fa fa-arrow-left"></i>
        <p>
          <span>User Detail</span>
        </p>
      </div>
      <hr />
      <div className="user-detail">
        <img src={`https://avatar.iran.liara.run/public/boy`} alt="" />
        <div className="user-info">
          <p>{selectedUser?.name || "N/A"}</p>
          <p>{selectedUser?.department || "N/A"}</p>
          <p>{selectedUser?.designation || "N/A"}</p>
        </div>
      </div>

      <div className="available-laptop">
        {allocatedAssets.length > 0 ? (
          <p>
            <i className="fa fa-laptop"></i> Allocated Asset
          </p>
        ) : (
          <p>
            <i className="fa fa-laptop"></i> Asset Not Allocated
          </p>
        )}
        {/* <hr /> */}

        {allocatedAssets.length > 0 &&
          allocatedAssets.map((asset) => (
            <NavLink to="/dashboard/total_asset/asset_detail"  key={asset._id}>
            <div className="laptop-data" onClick={() => viewAsset(asset)}>
              <img src={asset.pic1} alt="" />
              <input
                type="text"
                readOnly
                style={{ overflowX: "auto" }}
                value={asset.name || "N/A"}
                placeholder="Specifications"
              />
              <input
                type="text"
                readOnly
                style={{ overflowX: "auto" }}
                value={asset.desc || "N/A"}
                placeholder="Specifications"
              />

              <input
                type="text"
                readOnly
                style={{ overflowX: "auto" }}
                value={
                  installedSoftwareMap[asset._id]?.length > 0
                    ? installedSoftwareMap[asset._id]
                        .map((software) => software.name)
                        .join(", ")
                    : "No Installed Software"
                }
                placeholder="Software"
              />

              <input
                type="text"
                readOnly
                style={{ letterSpacing: "1px" }}
                value={asset.serial_num || "N/A"}
                placeholder="Serial Number"
              />
            </div>
            </NavLink>
          ))}
      </div>

      <div className="user-rejection">
        <div className="request-detail">
          <table>
            <tbody>
              <tr>
                <td>Email:</td>
                <td>{selectedUser?.email || "N/A"}</td>
              </tr>
              <tr>
                <td>Department:</td>
                <td>{selectedUser?.department || "N/A"}</td>
              </tr>
              <tr>
                <td>Designation:</td>
                <td>{selectedUser?.designation || "N/A"}</td>
              </tr>
              <tr>
                <td>Mobile:</td>
                <td>{selectedUser?.mobile || "N/A"}</td>
              </tr>
              <tr>
                <td>Address:</td>
                <td>{selectedUser?.address || "N/A"}</td>
              </tr>
              <tr>
                <td>Joined At:</td>
                <td>
                  {selectedUser?.createdAt
                    ? new Date(selectedUser.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })
                    : "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default User_detail;
