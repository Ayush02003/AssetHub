import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import useNotificationStore from "../../../zustand/useNotificationStore.js";
import useUserStore from "../../../zustand/useUserStore.js";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext.jsx";
import useAssetStore from "../../../zustand/useAssetStore.js";
import "../../../css/notification_details.css";
import Swal from "sweetalert2";
import { NavLink } from "react-router-dom";
const IT_Notification_detail = () => {
  const { authUser } = useAuthContext();
  const { selectedUser, fetchUsers, users, viewUser } = useUserStore();
  const [showPending, setShowPending] = useState(false);
  const [pending_Reason, setPendingReason] = useState("");
  const {
    selectedNotification,
    selectedRequest,
    fetchNotifications,
    assetAllocate_IT,
    assetPending,
    getPending,
    pendingReason,
  } = useNotificationStore();
  const {
    fetchAssets,
    assets,
    installedSoftware,
    fetchInstalledSoftware,
    allocatedAsset,
    selectedAsset,
    viewAsset,
  } = useAssetStore();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPendingReason = async () => {
      if (selectedRequest?.requestStatus === "Pending_By_IT") {
        await getPending(selectedRequest._id);
        setShowPending(true);
        setPendingReason(pendingReason || "");
      }
    };

    fetchPendingReason();
  }, [selectedRequest, pendingReason]);

  const handlePendingClick = () => {
    setShowPending(true);
  };
  const [selectedLaptop, setSelectedLaptop] = useState("");
  const handlePending = async () => {
    if (!pending_Reason) {
      toast.error("Please Give Reason");
      return;
    }
    await assetPending(authUser.id, pending_Reason);
    await fetchNotifications(authUser.id);
  };
  useEffect(() => {
    fetchUsers();
    fetchAssets();
    if (selectedRequest?._id) {
      allocatedAsset(selectedRequest._id);
    }
  }, [selectedRequest]);

  useEffect(() => {
    if (selectedLaptop) {
      fetchInstalledSoftware(selectedLaptop);
    } else if (selectedAsset?._id) {
      fetchInstalledSoftware(selectedAsset._id);
    }
  }, [selectedLaptop, selectedAsset]);

  useEffect(() => {
    if (selectedRequest?.requested_by && users.length > 0) {
      viewUser(selectedRequest.requested_by);
    }
  }, [selectedRequest, users]);

  if (!selectedNotification || !selectedRequest) {
    return <Navigate to="/dashboard/notification" />;
  }

  const handleApprove = async () => {
    if (!selectedLaptop) {
      toast.error("Please select a laptop.");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to allocate this laptop?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, allocate it!",
      cancelButtonText: "No, cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        assetAllocate_IT(authUser.id, selectedAssetDetail._id);
        await fetchNotifications(authUser.id);
        Swal.fire("Success!", "Laptop allocated successfully.", "success");
      }
    });
  };

  const handleLaptopChange = (e) => {
    const assetId = e.target.value;
    setSelectedLaptop(assetId);
  };

  const selectedAssetDetail = assets.find(
    (asset) => asset._id === selectedLaptop                     
  );

  return (
    <div className="main-noti-detail">
      <div className="title-container">
        <i onClick={() => navigate(-1)} className="fa fa-arrow-left"></i>
        <p>
          <span>Asset Request</span>
        </p>
      </div>
      <hr />
      <NavLink to="/dashboard/users/user_detail">
        <div className="user-detail">
          <img src={`https://avatar.iran.liara.run/public/boy`} alt="" />
          <div className="user-info">
            <p>{selectedUser?.name || "N/A"}</p>
            <p>{selectedUser?.department || "N/A"}</p>
            <p>{selectedUser?.designation || "N/A"}</p>
          </div>
        </div>
      </NavLink>
      <div className="available-laptop">
        {selectedAsset ? (
          <p>
            <i className="fa fa-laptop"></i> Allocated{" "}
            {selectedRequest.assetType}
          </p>
        ) : (
          <p>
            <i className="fa fa-laptop"></i> Available{" "}
            {selectedRequest.assetType}
          </p>
        )}
        <hr />
        <NavLink
          to={selectedAsset ? `/dashboard/total_asset/asset_detail` : "#"}
        >
          <div
            //  style={{ pointerEvents: selectedAsset ? "auto" : "none" }}
            className="laptop-data"
            onClick={selectedAsset ? () => viewAsset(selectedAsset) : undefined}
          >
            {selectedAsset ? (
              <img src={selectedAsset.pic1} alt="" />
            ) : selectedAssetDetail ? (
              <img src={selectedAssetDetail.pic1} alt="" />
            ) : null}
            <select
              name=""
              id=""
              onChange={handleLaptopChange}
              disabled={!!selectedAsset}
            >
              <option value="">-- Select {selectedRequest.assetType} --</option>
              {selectedAsset && (
                <option
                  key={selectedAsset._id}
                  value={selectedAsset._id}
                  selected
                >
                  {selectedAsset.name}
                </option>
              )}
              {assets
                .filter((asset) => asset.status !== "Assigned")
                .filter((asset) => asset.type === selectedRequest.assetType)
                .map((asset) => (
                  <option
                    key={asset._id}
                    value={asset._id}
                    selected={selectedAsset?._id === asset._id}
                  >
                    {asset.name}
                  </option>
                ))}
            </select>

            <input
              type="text"
              readOnly
              style={{
                overflowX: "auto",
              }}
              value={
                selectedAsset
                  ? selectedAsset.desc
                  : selectedAssetDetail?.desc || ""
              }
              placeholder="Specifications"
            />

            <input
              type="text"
              readOnly
              style={{
                overflowX: "auto",
              }}
              value={
                selectedAssetDetail || selectedAsset
                  ? installedSoftware.length > 0
                    ? installedSoftware
                        .map((software) => software.name)
                        .join(", ")
                    : "No Installed Software"
                  : ""
              }
              placeholder="Software"
            />
            <input
              type="text"
              readOnly
              style={{ letterSpacing: "1px" }}
              value={
                selectedAsset
                  ? selectedAsset.serial_num
                  : selectedAssetDetail?.serial_num || ""
              }
              placeholder="Serial Number"
            />
          </div>
        </NavLink>
      </div>

      <div className="user-rejection">
        <div className="request-detail">
          <table>
            <tbody>
              <tr>
                <td>Asset Type:</td>
                <td>{selectedRequest?.assetType || "N/A"}</td>
              </tr>
              <tr>
                <td>Specification:</td>
                <td>{selectedRequest?.specifications || "N/A"}</td>
              </tr>
              <tr>
                <td>Software Requirements:</td>
                <td>{selectedRequest?.softwareRequirements || "N/A"}</td>
              </tr>
              <tr>
                <td>Need:</td>
                <td>{selectedRequest?.assetNeed || "N/A"}</td>
              </tr>
              <tr>
                <td>Expected Duration:</td>
                <td>{selectedRequest?.expectedDuration || "N/A"}</td>
              </tr>
              <tr>
                <td>Required At:</td>
                <td>{selectedRequest?.address || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {showPending && (
          <div className="rejection-detail">
            <>
              <p style={{ color: "#f9a825", borderLeft: "4px solid #f9a825" }}>
                Pending Reason
              </p>
              <textarea
                value={pending_Reason || ""}
                placeholder={pending_Reason ? "" : "Enter pending reason..."}
                onChange={(e) => setPendingReason(e.target.value)}
                style={{
                  backgroundColor: "#fff8e1",
                  padding: "10px",
                  fontSize: "16px",
                  borderRadius: "8px",
                  outline: "none",
                  resize: "none",
                  boxShadow: "0 0 3px rgba(0, 0, 0, 0.08)",
                }}
              ></textarea>

              <button className="confirm-pending" onClick={handlePending}>
                Confirm Pending
              </button>
            </>
          </div>
        )}
      </div>
      <div className="action-buttons">
        {selectedRequest.requestStatus !== "Asset_Allocated" ? (
          <>
            <button className="approve-btn" onClick={handleApprove}>
              Allocate
            </button>
            <button className="pending-btn" onClick={handlePendingClick}>
              Mark as Pending
            </button>
          </>
        ) : (
          <button className="approve-btn" style={{ width: "60%" }}>
            Asset Allocated By You
          </button>
        )}
      </div>
    </div>
  );
};

export default IT_Notification_detail;
