import useNotificationStore from "../../../zustand/useNotificationStore.js";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import useUserStore from "../../../zustand/useUserStore.js";
import "../../../css/notification_details.css";
import { useNavigate } from "react-router-dom";
// import { useAuthContext } from "../../../context/AuthContext.jsx";
import useAssetStore from "../../../zustand/useAssetStore.js";
// import Swal from "sweetalert2";
import { NavLink } from "react-router-dom";
const Emp_Notification_detail = () => {
  // const { authUser } = useAuthContext();
  const { selectedUser, fetchUsers, users, viewUser } = useUserStore();
  const {
    selectedNotification,
    selectedRequest,
    getRejection,
    rejectionReason,
    pendingReason,
    getPending,
  } = useNotificationStore();
  // const [rejectionReason, setRejectionReason] = useState("");
  const {
    installedSoftware,
    fetchInstalledSoftware,
    allocatedAsset,
    selectedAsset,
  } = useAssetStore();

  const navigate = useNavigate();
  useEffect(() => {
    fetchUsers();
    if (selectedRequest?._id) {
      allocatedAsset(selectedRequest._id);
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

  useEffect(() => {
    if (selectedRequest?.requestStatus === "Rejected") {
      getRejection(selectedRequest._id);
    }
      if (selectedRequest?.requestStatus === "Pending_By_IT") {
        getPending(selectedRequest._id);
      }
  }, [selectedRequest]);
  if (!selectedNotification || !selectedRequest) {
    return <Navigate to="/dashboard/notification" />;
  }

  return (
    <div className="main-noti-detail">
      <div className="title-container">
        <i onClick={() => navigate(-1)} className="fa fa-arrow-left"></i>
        <p>
          <span>Asset Request</span>
        </p>
      </div>
      <hr />
      {/* <NavLink to="/dashboard/users/user_detail"> */}
      <div className="user-detail">
        <img src={`https://avatar.iran.liara.run/public/boy`} alt="" />
        <div className="user-info">
          <p>{selectedUser?.name || "N/A"}</p>
          <p>{selectedUser?.department || "N/A"}</p>
          <p>{selectedUser?.designation || "N/A"}</p>
        </div>
      </div>
      {/* </NavLink> */}
      {selectedNotification.message === "Your asset has been allocated" &&
        selectedAsset &&
        selectedRequest.requestStatus === "Asset_Allocated" && (
          <>
            <div className="available-laptop">
              <p>
                <i className="fa fa-laptop"></i> Allocated Laptop
              </p>
              <hr />
              <div className="laptop-data">
              {selectedAsset && (
              <img src={selectedAsset.pic1} alt="" />
            ) }
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
                  style={{letterSpacing:"2px"}}
                  value={selectedAsset.serial_num}
                  placeholder="Specifications"
                />

              </div>
            </div>
          </>
        )}
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
        {selectedNotification.message === "Your asset request has been pending by IT-Person" && pendingReason  && (
          <>
            <div className="rejection-detail">
              <p style={{ color: "#f9a825", borderLeft: "4px solid #f9a825" }}>
                Pending Reason
              </p>
              <textarea
                value={selectedNotification.pending_reason}
                readOnly
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
            </div>
          </>
        )}
        {rejectionReason && selectedRequest.requestStatus === "Rejected" && (
          <div className="rejection-detail">
            <p >Rejection Reason</p>
            <textarea
              placeholder="Rejection Reason"
              style={{backgroundColor: "#ffccbc"}}
              value={rejectionReason}
              readOnly
            ></textarea>
          </div>
        )}
      </div>
      <div className="action-buttons">
        {selectedNotification.message === "Your asset has been allocated" ? (
          <button className="approve-btn" style={{ width: "60%" }}>
            Asset Allocated
          </button>
        ) : selectedNotification.message ===
          "Your asset request has been approved by HR" ? (
          <button className="approve-btn" style={{ width: "60%" }}>
            Request Approved By HR
          </button>
        ) : selectedRequest.requestStatus === "Pending_By_IT" && (
          <button className="pending-btn" style={{ width: "60%" }}>
            Allocation Pending By IT_Person
          </button>
        )}
      </div>
    </div>
  );
};

export default Emp_Notification_detail;
