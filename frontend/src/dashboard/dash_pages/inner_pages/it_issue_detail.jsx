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
const IT_issue_detail = () => {
  const { authUser } = useAuthContext();
  const { selectedUser, fetchUsers, users, viewUser } = useUserStore();
  const [showNotify, setShowNotify] = useState(true);
  const [showReject, setShowReject] = useState(false);
  const [notification, setNotification] = useState("");
  const [rejection_Reason, setRejectionReason] = useState("");
  const {
    sendNotification,
    selectedNotification,
    selectedRequest,
    fetchNotifications,

    underProcess_IT,
    issueSolved_IT,
  } = useNotificationStore();
  const {
    fetchAssets,
    assets,
    installedSoftware,
    fetchInstalledSoftware,
    softwareAsset,
    selectedAsset,
    viewAsset,
  } = useAssetStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotification = async () => {
      if (
        selectedRequest?.review_comment &&
        !selectedRequest.rejection_reason
      ) {
        setNotification(selectedRequest.review_comment);
        // setShowNotify(true);
      } else if (selectedRequest?.requestStatus === "Request Rejected") {
        setRejectionReason(selectedRequest.rejection_reason);
        setShowNotify(false);
        setShowReject(true);
      }
    };
    fetchNotification();
  }, [selectedRequest]);

  const handleRejectClick = () => {
    setShowNotify(false);
    setShowReject(true);
  };
  const [selectedLaptop, setSelectedLaptop] = useState("");
  const handleNotification = async () => {
    if (!notification && showNotify) {
      toast.error("Please Provide Message");
      return;
    } else if (!rejection_Reason && showReject) {
      toast.error("Provide Rejection Reason");
      return;
    }
    const msg = showNotify ? notification : rejection_Reason;
    const type = showNotify ? "noti" : "reject";
    await sendNotification(authUser.id, msg, type);
    await fetchNotifications(authUser.id);
  };

  useEffect(() => {
    fetchUsers();
    fetchAssets();
    if (selectedRequest) {
      softwareAsset(selectedRequest?.asset_id);
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

  const handleInitiate = async () => {
    underProcess_IT(authUser.id);
  };
  const handleApprove = async () => {
    const isMaintenance = selectedRequest.type === "maintenance";

    Swal.fire({
      title: isMaintenance
        ? "Confirm Maintenance Resolution?"
        : "Confirm Asset Lost?",
      text: isMaintenance
        ? "Are you sure the asset has been fixed and is ready to be used again?"
        : "Are you sure the lost item issue has been resolved or handled?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: isMaintenance
        ? "Yes, Mark as Resolved"
        : "Yes, Mark as Resolved",
      cancelButtonText: "No, Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await issueSolved_IT(authUser.id);
        await fetchNotifications(authUser.id);
        Swal.fire(
          "Updated!",
          isMaintenance
            ? "The asset has been marked as resolved and is no longer under maintenance."
            : "The lost asset issue has been marked as resolved.",
          "success"
        );
      }
    });
  };
  const handleFound = async () => {
    const confirm = await Swal.fire({
      title: "Confirm Asset Found?",
      text: "Are you sure the asset has been recovered and is no longer considered lost?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Mark as Found",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        await issueSolved_IT(authUser.id, "Asset_Found");
        await fetchNotifications(authUser.id);
        toast.success("Asset marked as found and updated successfully!");
      } catch (err) {
        toast.error("Something went wrong while updating." + err);
      }
    }
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
          {selectedRequest.type === "maintenance" ? (
            <span>Maintenance Request</span>
          ) : (
            <span>Lost Report</span>
          )}
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
            {selectedRequest.type === "maintenance" ? (
              `${selectedAsset.type} for Maintenance`
            ) : (
              <>
                <i className="fa fa-laptop"></i>
                Lost {selectedAsset.type}
              </>
            )}
          </p>
        ) : (
          <p>
            <>
              <i className="fa fa-laptop"></i> Asset Not Found
            </>
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
                <td>Description:</td>
                <td>{selectedRequest?.description || "N/A"}</td>
              </tr>

              {selectedRequest?.type === "lost" && (
                <tr>
                  <td>Lost Date:</td>
                  <td>
                    {selectedRequest?.lost_date
                      ? new Date(selectedRequest.lost_date).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "N/A"}
                  </td>
                </tr>
              )}

              <tr>
                <td>Supporting Document:</td>
                <td>
                  {selectedRequest?.file ? (
                    <a
                      href={selectedRequest.file}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={selectedRequest.file}
                        alt="Preview"
                        style={{
                          height: "80px",
                          objectFit: "cover",
                          cursor: "pointer",
                          borderRadius: "5px",
                          boxShadow: "0px 0px 2px gray",
                        }}
                      />
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {showNotify && (
          <div className="rejection-detail">
            <>
              <p style={{ color: "#f9a825", borderLeft: "4px solid #f9a825" }}>
                Notify User
              </p>
              <textarea
                value={notification || ""}
                placeholder={
                  notification
                    ? ""
                    : "Enter a message to notify the user about the status update."
                }
                onChange={(e) => setNotification(e.target.value)}
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
              {selectedRequest.requestStatus !== "Issue_Resolved" && (
                <button
                  className="confirm-pending"
                  onClick={handleNotification}
                >
                  Send Notification
                </button>
              )}
            </>
          </div>
        )}
        {showReject && (
          <div className="rejection-detail">
            {selectedRequest.requestStatus === "Request Rejected" &&
            rejection_Reason ? (
              <>
                <p>Rejection Reason</p>
                <textarea
                  style={{ backgroundColor: "#ffccbc" }}
                  value={rejection_Reason}
                  readOnly
                ></textarea>
              </>
            ) : (
              <>
                <p>Rejection Reason</p>
                <textarea
                  placeholder="Enter rejection reason..."
                  value={rejection_Reason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                ></textarea>
                <button className="confirm-reject" onClick={handleNotification}>
                  Confirm Rejection
                </button>
              </>
            )}
          </div>
        )}
      </div>
      <div className="action-buttons">
        {selectedRequest.requestStatus === "Under_Maintenance" ||
        selectedRequest.requestStatus === "Under_Process" ? (
          <>
            <button className="approve-btn" onClick={handleApprove}>
              <p>
                {selectedRequest.type === "lost"
                  ? "Asset Lost"
                  : "Issue Resolved?"}
              </p>
            </button>         
            <button className="reject-btn" onClick={handleRejectClick}>
              Reject
            </button>
          </>
        ) : selectedRequest.type === "maintenance" &&
          selectedRequest.requestStatus !== "Issue_Resolved" &&
          selectedRequest.requestStatus !== "Request Rejected" ? (
          <>
            <button className="approve-btn" onClick={handleInitiate}>
              Mark Under Maintenance
            </button>
            <button className="reject-btn" onClick={handleRejectClick}>
              Reject
            </button>
          </>
        ) : selectedRequest.type === "lost" &&
          selectedRequest.requestStatus !== "Issue_Resolved" &&
          selectedRequest.requestStatus !== "Request Rejected" ? (
          <>
            <button className="approve-btn" onClick={handleInitiate}>
              Mark Under Process
            </button>
            <button className="reject-btn" onClick={handleRejectClick}>
              Reject
            </button>
          </>
        ) : selectedRequest.requestStatus === "Request Rejected" ? (
          <>
            <button
              className="reject-btn"
              onClick={handleRejectClick}
              style={{ width: "60%" }}
            >
              Asset {selectedRequest.type} Request Rejected By You
            </button>
          </>
        ) : (
          <button className="approve-btn" style={{ width: "60%" }}>
            Asset Issue Resolved
          </button>
        )}
        {selectedRequest.type === "lost" &&
          selectedRequest.requestStatus === "Under_Process" && (
            <button className="approve-btn" onClick={handleFound}>
              Mark Asset as Found
            </button>
          )}
      </div>
    </div>
  );
};

export default IT_issue_detail;
