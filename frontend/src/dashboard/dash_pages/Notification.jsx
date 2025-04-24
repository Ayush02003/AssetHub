import { useEffect, useState } from "react";
import "../../css/notification.css";
import useNotificationStore from "../../zustand/useNotificationStore.js";
import { useAuthContext } from "../../context/AuthContext.jsx";
import { NavLink } from "react-router-dom";

const getIconClass = (type) => {
  switch (type.toLowerCase()) {
    case "asset request":
      return "fa fa-laptop";
    case "software expiry":
      return "fa fa-clock";
    case "software request":
      return "fa fa-laptop-code";
    case "maintenance":
      return "fa fa-wrench";
    case "lost":
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

  const statusOptions = [
    ...new Set(           
      notifications
        .filter((noti) => (filterType ? noti.type === filterType : true))
        .map((noti) => {
          if (noti.type === "Software Expiry") return "software_expired";
          const request = requests.find((req) => req._id === noti.requestId);
          return request?.requestStatus;
        })
    ),
  ].filter(Boolean);

  useEffect(() => {
    if (filterStatus && !statusOptions.includes(filterStatus)) {
      setFilterStatus("");
    }
  }, [filterType]);

  const filteredNotification = notifications.filter((noti) => {
    let match;

    // if (authUser.role === "IT-Person") {
    match = noti.message.match(/(.+)/i);
    // match = noti.message.match(/to (.+)/i);
    // } else if (authUser.role === "HR") {
    // match = noti.message.match(/(.+)/i);
    // match = noti.message.match(/Request from (.+)/i);
    // }

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
        <h2 style={{ padding: "5px 0px" }}>Notification Management</h2>
        {authUser.role !== "Employe" && (
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
              {authUser.role !== "Employee" && (
                <>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">All Status</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </>
              )}
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
              // if (
              //   filterStatus &&
              //   (notif.type !== "Software Expiry"
              //     ? !matchingRequest ||
              //       matchingRequest.requestStatus !== filterStatus
              //     : filterStatus !== "software_expired")
              // ) {
              //   return null;
              // }
              if (filterStatus) {
                if (filterStatus === "Response") {
                  const isResponseMessage =
                    notif.message.includes("responded to");
                  if (!isResponseMessage) return null;
                } else if (notif.type === "Software Expiry") {
                  if (filterStatus !== "software_expired") return null;
                } else if (
                  !matchingRequest ||
                  matchingRequest.requestStatus !== filterStatus
                ) {
                  return null;
                }
              }
              const isUnread = notif.status === "unread";

              return (
                <NavLink
                  to={(() => {
                    if (notif.type === "Software Expiry") {
                      return authUser.role === "Employee"
                        ? "/dashboard/home"
                        : `/dashboard/total_asset/asset_detail?id=${notif.assetId}`;
                    }

                    const basePath = "/dashboard/notification/";

                    if (authUser.role === "HR") {
                      return basePath + "hr_notification_detail";
                    }

                    if (authUser.role === "IT-Person") {
                      if (notif.type === "Asset Issue Request") {
                        return basePath + "it_issue_detail";
                      } else if (notif.type === "Asset Return Request") {
                        return basePath + "it_return_detail";
                      } else {
                        return basePath + "it_notification_detail";
                      }
                    }

                    if (authUser.role === "Employee") {
                      if (notif.type === "Asset Return Request") {
                        return basePath + "emp_return_detail";
                      }
                      return (
                        basePath +
                        (notif.type === "Asset Issue Request"
                          ? "emp_issue_detail"
                          : "emp_notification_detail")
                      );
                    }

                    return basePath + "emp_notification_detail";
                  })()}
                  key={notif._id}
                  onClick={() => {
                    if (notif.type !== "Software Expiry") {
                      viewNotification(notif);
                      viewRequest(matchingRequest);
                    }
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
                        className={getIconClass(
                          notif.message.toLowerCase().includes("lost")
                            ? "lost"
                            : notif.message
                                .toLowerCase()
                                .includes("maintenance")
                            ? "maintenance"
                            : notif.type
                        )}
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
                          "Software has been installed": (
                            <p className="software_installed">
                              Software Installed
                            </p>
                          ),
                          "IT has responded to your maintenance request. View their message":
                            <p className="approved_by_hr">Response</p>,
                          "Your maintenance request is now being processed by IT.":
                            (
                              <p className="under_maintenance">
                                Under Maintenance
                              </p>
                            ),
                          "IT has responded to your asset return request. View their message":
                            <p className="approved_by_hr">Response</p>,
                          "Your asset return request is now being processed by IT.":
                            (
                              <p className="under_maintenance">
                                Under Maintenance
                              </p>
                            ),
                          "Your asset return request is completed.": (
                            <p className="return_completed">Return Completed</p>
                          ),
                          "Your maintenance request has been rejected by IT.": (
                            <p className="rejected">Request Rejected</p>
                          ),
                          "Your lost request is now being processed by IT.": (
                            <p className="under_process">Under Process</p>
                          ),
                          "Your lost request has been rejected by IT.": (
                            <p className="software_expired">Rejected</p>
                          ),
                          "Your maintenance request is resolved.": (
                            <p className="issue_resolved">Issue Resolved</p>
                          ),
                          "Your lost request is resolved.": (
                            <p className="issue_resolved">Issue Resolved</p>
                          ),
                          "Your software request has been rejected by HR": (
                            <p className="rejected">Rejected</p>
                          ),
                          "Your software request has been approved by HR": (
                            <p className="approved_by_hr">Approved By HR</p>
                          ),
                          "Your software request has been pending by IT-Person":
                            <p className="pending_by_it">Pending By IT</p>,
                        }[notif.message] ||
                        (notif.type?.toLowerCase() === "software expiry" ? (
                          <p className="software_expired">Software Expired</p>
                        ) : (
                          <p className="default-status">No Request</p>
                        ))
                      ) : matchingRequest ? (
                        <p
                          className={matchingRequest.requestStatus?.toLowerCase()}
                        >
                          {matchingRequest.requestStatus}
                        </p>
                      ) : notif.type?.toLowerCase() === "software expiry" ? (
                        <p className="software_expired">Software Expired</p>
                      ) : notif.type?.toLowerCase() === "software request" ? (
                        <p className="software_request">Software Request</p>
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
