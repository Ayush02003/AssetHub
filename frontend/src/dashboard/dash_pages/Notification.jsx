import { useEffect, useState } from "react";
import "../../css/notification.css";
import useNotificationStore from "../../zustand/useNotificationStore.js";
import { useAuthContext } from "../../context/AuthContext.jsx";
import { NavLink } from "react-router-dom";

const getIconClass = (type) => {
  switch (type.toLowerCase()) {
    case "asset request":
      return "fa fa-laptop";
    case "maintenance request":
      return "fa fa-wrench";
    case "system update":
      return "fa fa-laptop";
    case "warning":
      return "fa fa-exclamation-triangle";
    default:
      return "fa fa-bell";
  }
};

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};
//  const [filterEmail, setFilterEmail] = useState("");

const Notification = () => {
  const { authUser } = useAuthContext();
  const {
    requests,
    viewRequest,
    viewNotification,
    notifications,
    fetchNotifications,
    changeNotificationStatus,
  } = useNotificationStore();

  useEffect(() => {
    if (authUser?.id) {
      fetchNotifications(authUser.id, authUser.role);
    }
  }, [authUser.id]);

  const [filterType, setFilterType] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filteredNotification = notifications.filter((noti) => {
    let match;

    if (authUser.role === "IT-Person") {
      match = noti.message.match(/to (.+)/i);
    } else if (authUser.role === "HR") {
      match = noti.message.match(/Request from (.+)/i);
    }

    const extractedName = match ? match[1] : "";

    return (
      (filterName
        ? extractedName.toLowerCase().includes(filterName.toLowerCase())
        : true) && (filterType ? noti.type === filterType : true)
    );
  });

  return (
    <div className="user-main-noti">
      <div className="upper-component">
        <h2 style={{padding:"5px 0px"}}>Notification Management</h2>
        {authUser.role !== "Employee" && (
          <>
            <hr />
            <div className="filter-container">
            <div>
                <input
                  type="text"
                  placeholder="Search by Name"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                />
                <i className="fa fa-user"></i>
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">All Type</option>
                {[...new Set(notifications.map((noti) => noti.type))].map(
                  (type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  )
                )}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                {/* {filterType === "Asset Request" && ( */}
                  <>
                    <option value="Asset_Allocated">Allocated</option>
                    <option value="Pending_By_IT">Pending</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Approved_By_HR">Approved By HR</option>
                  </>
                {/* )} */}
              </select>
              
            </div>
          </>
        )}
      </div>
      <div className="lower-component">
        {filteredNotification.length === 0 ? (
          <p className="no-notifications">No Notifications</p>
        ) : (
          filteredNotification
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((notif) => {
              const matchingRequest = requests.find(
                (req) => req._id === notif.requestId
              );
              if (
                filterStatus &&
                (!matchingRequest ||
                  matchingRequest.requestStatus !== filterStatus)
              ) {
                return null;
              }
              const isUnread = notif.status === "unread";

              return (
                <NavLink
                  to={`/dashboard/notification/${
                    authUser.role === "HR"
                      ? "hr_notification_detail"
                      : authUser.role === "IT-Person"
                      ? "it_notification_detail"
                      : "emp_notification_detail"
                  }`}
                  key={notif._id}
                  onClick={() => {
                    viewNotification(notif);
                    viewRequest(matchingRequest);
                    changeNotificationStatus(notif._id, authUser.role);
                  }}
                >
                  <div
                    className={`inner-component ${notif.type
                      .toLowerCase()
                      .replace(/\s+/g, "-")} ${
                      isUnread ? "unread-notification" : ""
                    }`}
                  >
                    <div
                      className={`icon ${notif.type
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      <i
                        className={getIconClass(notif.type)}
                        aria-hidden="true"
                      ></i>
                    </div>
                    <div className="noti">
                      <p>{notif.type}</p>
                      <p>{notif.message}</p>
                    </div>
                    <div className="status">
                      {authUser.role === "Employee" && notif.message ? (
                        {
                          "Your asset request has been approved by HR": (
                            <p className="approved_by_hr">Approved By HR</p>
                          ),
                          "Your asset request has been pending by IT-Person": (
                            <p className="pending_by_it">Pending By IT</p>
                          ),
                          "Your asset request has been rejected by HR": (
                            <p className="rejected">Rejected</p>
                          ),
                          "Your asset has been allocated": (
                            <p className="asset_allocated">Asset Allocated</p>
                          ),
                        }[notif.message] || (
                          <p className="default-status">No Request</p>
                        )
                      ) : matchingRequest ? (
                        <p
                          className={matchingRequest.requestStatus?.toLowerCase()}
                        >
                          {matchingRequest.requestStatus}
                        </p>
                      ) : (
                        <p className="default-status">No Request</p>
                      )}
                    </div>

                    <div className="time">
                      <i className="fa-regular fa-clock" aria-hidden="true"></i>
                      <p>{formatDate(notif.createdAt)}</p>
                    </div>
                  </div>
                </NavLink>
              );
            })
        )}
      </div>
    </div>
  );
};

export default Notification;
