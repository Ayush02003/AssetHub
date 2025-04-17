import useNotificationStore from "../../../zustand/useNotificationStore.js";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import useUserStore from "../../../zustand/useUserStore.js";
import "../../../css/notification_details.css";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext.jsx";
import useAssetStore from "../../../zustand/useAssetStore.js";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";
const HR_Notification_detail = () => {
  const { authUser } = useAuthContext();
  const { selectedUser, fetchUsers, users, viewUser } = useUserStore();
  const {
    selectedNotification,
    selectedRequest,
    assetApprove_HR,
    softwareApprove,
    fetchNotifications,
    assetReject,
    getRejection,
    getPending,
    pendingReason,
    rejectionReason,
    softwareReject,
  } = useNotificationStore();
  const [showRejection, setShowRejection] = useState(false);
  const [rejection_Reason, setRejectionReason] = useState("");
  const {
    installedSoftware,
    fetchInstalledSoftware,
    allocatedAsset,
    selectedAsset,
    softwareAsset,
    viewAsset,
  } = useAssetStore();

  const navigate = useNavigate();
  useEffect(() => {
    if (selectedRequest?.requestStatus === "Rejected") {
      if (selectedRequest.name) {
        setRejectionReason(selectedRequest.rejection_reason);
      } else {
        getRejection(selectedRequest._id);
      }
      setShowRejection("true");
    }
    if (selectedRequest?.requestStatus === "Pending_By_IT") {
      // if (!selectedRequest.name) {
      getPending(selectedRequest._id);
      // }
    }
  }, [selectedRequest]);
  useEffect(() => {
    fetchUsers();
    if (
      selectedRequest?._id &&
      selectedRequest.requestStatus === "Asset_Allocated"
    ) {
      allocatedAsset(selectedRequest?._id);
    } else if (selectedRequest?.name) {
      softwareAsset(selectedRequest?.asset_id);
    }
  }, [selectedRequest]);

  useEffect(() => {
    if (selectedAsset?._id) {
      fetchInstalledSoftware(selectedAsset._id);
    }
  });
  useEffect(() => {
    if (selectedRequest?.requested_by && users.length > 0) {
      viewUser(selectedRequest.requested_by);
    }
  }, [selectedRequest, users]);

  if (!selectedNotification || !selectedRequest) {
    return <Navigate to="/dashboard/notification" />;
  }

  const handleRejectClick = () => {
    setShowRejection(true);
  };
  const handleRejected = async () => {
    if (!rejection_Reason) {
      toast.error("Please Give Reason");
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to reject asset request?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, reject request!",
      cancelButtonText: "No, cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (selectedRequest.name) {
          await softwareReject(authUser._id, rejection_Reason);
        } else {
          await assetReject(authUser.id, rejection_Reason);
        }
        await fetchNotifications(authUser.id);
        Swal.fire("Success!", "Request rejected successfully.", "success");
      }
    });
  };
  const handleApprove = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to approve request?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, approve request!",
      cancelButtonText: "No, cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (selectedRequest.name) {
          await softwareApprove(authUser.id);
        } else {
          await assetApprove_HR(authUser.id);
        }
        await fetchNotifications(authUser.id);
        Swal.fire("Success!", "Request approved successfully.", "success");
      }
    });
  };

  return (
    <div className="main-noti-detail">
      <div className="title-container">
        <i onClick={() => navigate(-1)} className="fa fa-arrow-left"></i>
        <p>
          {selectedRequest?.name ? (
            <span>Software Request</span>
          ) : (
            <span>Asset Request</span>
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
      {selectedAsset &&
        (selectedRequest.requestStatus === "Asset_Allocated" ||
          selectedRequest.name) && (
          <>
            <div className="available-laptop">
              <p>
                <i className="fa fa-laptop"></i>
                {selectedRequest.name
                  ? "Allocated Laptop"
                  : "Laptop for Software Installation"}
              </p>
              <hr />
              <NavLink
                to="/dashboard/total_asset/asset_detail"
                key={selectedAsset._id}
              >
                <div
                  className="laptop-data"
                  onClick={() => viewAsset(selectedAsset)}
                >
                  <img src={selectedAsset.pic1} alt="" />
                  <input
                    type="text"
                    readOnly
                    value={selectedAsset.name}
                    placeholder="Specifications"
                  />
                  <input
                    type="text"
                    readOnly
                    value={selectedAsset.desc}
                    placeholder="Specifications"
                  />

                  <input
                    type="text"
                    readOnly
                    value={
                      installedSoftware.length > 0
                        ? installedSoftware
                            .map((software) => software.name)
                            .join(", ")
                        : "No Installed Software"
                    }
                    placeholder="Software"
                  />
                  <input
                    type="text"
                    readOnly
                    value={selectedAsset.serial_num}
                    placeholder="Specifications"
                  />
                </div>
              </NavLink>
            </div>
          </>
        )}
      <div className="user-rejection">
        <div className="request-detail">
          <table>
            <tbody>
              {selectedRequest?.name ? (
                <>
                  <tr>
                    <td>Software Name:</td>
                    <td>{selectedRequest?.name || "N/A"}</td>
                  </tr>
                  <tr>
                    <td>Version:</td>
                    <td>{selectedRequest?.version || "N/A"}</td>
                  </tr>
                  <tr>
                    <td>Software Purpose:</td>
                    <td>{selectedRequest?.softwarePurpose || "N/A"}</td>
                  </tr>
                  <tr>
                    <td>Expected Duration:</td>
                    <td>{selectedRequest?.expectedDuration || "N/A"}</td>
                  </tr>
                </>
              ) : (
                <>
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
                </>
              )}
            </tbody>
          </table>
        </div>

        {pendingReason && selectedRequest.requestStatus === "Pending_By_IT" && (
          <>
            <div className="rejection-detail">
              <p style={{ color: "#f9a825", borderLeft: "4px solid #f9a825" }}>
                Pending Reason
              </p>
              <textarea
                value={pendingReason}
                readOnly
                style={{
                  backgroundColor: "#fff8e1",
                }}
              ></textarea>
            </div>
          </>
        )}
        {showRejection &&
          selectedRequest.requestStatus !== "Approved_By_HR" && (
            <div className="rejection-detail">
              {rejectionReason || rejection_Reason ? (
                <>
                  <p>Rejection Reason</p>
                  <textarea
                    style={{ backgroundColor: "#ffccbc" }}
                    value={rejectionReason || rejection_Reason}
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
                  <button className="confirm-reject" onClick={handleRejected}>
                    Confirm Rejection
                  </button>
                </>
              )}
            </div>
          )}
      </div>
      <div className="action-buttons">
        {selectedRequest.requestStatus === "Pending" ? (
          <>
            <button className="approve-btn" onClick={handleApprove}>
              Approve
            </button>
            <button className="reject-btn" onClick={handleRejectClick}>
              Reject
            </button>
          </>
        ) : selectedRequest.requestStatus === "Rejected" ? (
          <button className="reject-btn" style={{ width: "60%" }}>
            Request Rejected By You
          </button>
        ) : selectedRequest.requestStatus === "Asset_Allocated" ? (
          <button className="approve-btn" style={{ width: "60%" }}>
            Asset Allocated
          </button>
        ) : selectedRequest.requestStatus === "Software_Installed" ? (
          <button className="approve-btn" style={{ width: "60%" }}>
            Software Installed By IT-Person
          </button>
        ) : selectedRequest.requestStatus === "Approved_By_HR" ? (
          <button className="approve-btn" style={{ width: "60%" }}>
            Request Approved By You
          </button>
        ) : (
          selectedRequest.requestStatus === "Pending_By_IT" && (
            <button className="pending-btn" style={{ width: "60%" }}>
              Allocation Pending By IT_Person
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default HR_Notification_detail;
