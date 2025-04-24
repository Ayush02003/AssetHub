import HR_Notification from "../models/hr_notificationModel.js";
import IT_Notification from "../models/it_notificationModel.js";
import AssetRejection from "../models/assetRejectionModel.js";
import Employee_Notification from "../models/employee_notificationModel.js";
import AssetRequest from "../models/assetRequestModel.js";
import SoftwareRequest from "../models/softwareRequestModel.js";
import AssetIssue from "../models/assetIssueModel.js";
import AssetReturn from "../models/assetReturnModel.js";
import Asset from "../models/assetModel.js";
import Employee from "../models/employeeModel.js";
import AssetAllocation from "../models/assetAllocationModel.js";
import Software from "../models/softwareModel.js";
import moment from "moment";
import {
  createITNotification,
  createEmployeeNotification,
} from "../utils/createNotification.js";
export const getNotification = async (req, res) => {
  try {
    const { userId, role } = req.body;
    let notificationModel;

    if (role === "HR") {
      notificationModel = HR_Notification;
    } else if (role === "IT-Person") {
      notificationModel = IT_Notification;
    } else {
      notificationModel = Employee_Notification;
    }

    const notifications = await notificationModel.find({ receiverId: userId });

    const requestIds = notifications.map((notif) => notif.requestId);

    const [assetRequests, softwareRequests, assetIssues, assetReturns] =
      await Promise.all([
        AssetRequest.find({ _id: { $in: requestIds } }),
        SoftwareRequest.find({ _id: { $in: requestIds } }),
        AssetIssue.find({ _id: { $in: requestIds } }),
        AssetReturn.find({ _id: { $in: requestIds } }),
      ]);

    const combinedRequests = [
      ...assetRequests,
      ...softwareRequests,
      ...assetIssues,
      ...assetReturns,
    ];

    return res.status(200).json({ notifications, requests: combinedRequests });
  } catch (error) {
    console.error("Error in getNotification:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const asset_Approve_HR = async (req, res) => {
  try {
    const { requestId, requested_by } = req.body;
    const request = await AssetRequest.findById({ _id: requestId });
    const user = await Employee.findById(requested_by);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let itUsers = await Employee.find({
      department: user.department,
      designation: "IT-Person",
    });

    if (itUsers.length === 0) {
      itUsers = await Employee.find({
        department: "All",
        designation: "IT-Person",
      });
    }
    if (itUsers.length === 0) {
      return res
        .status(404)
        .json({ error: "No IT Person found to process this request" });
    }

    request.requestStatus = "Approved_By_HR";
    request.save();
    await Promise.all(
      itUsers.map((it) =>
        createITNotification({
          receiverId: it._id,
          requestId: request._id,
          type: "Asset Request",
          message: `Allocate Asset to ${user.name}`,
          status: "unread",
        })
      )
    );
    const employeeNotification = createEmployeeNotification({
      receiverId: user._id,
      requestId: request._id,
      type: "Asset Request",
      message: "Your asset request has been approved by HR",
      status: "unread",
    });

    return res.status(200).json({ request });
  } catch (error) {
    console.error("Error in getNotifications:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const software_Approve = async (req, res) => {
  try {
    const { requestId, requested_by } = req.body;
    const request = await SoftwareRequest.findById({ _id: requestId });
    const user = await Employee.findById(requested_by);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let itUsers = await Employee.find({
      department: user.department,
      designation: "IT-Person",
    });

    if (itUsers.length === 0) {
      itUsers = await Employee.find({
        department: "All",
        designation: "IT-Person",
      });
    }
    if (itUsers.length === 0) {
      return res
        .status(404)
        .json({ error: "No IT Person found to process this request" });
    }

    request.requestStatus = "Approved_By_HR";
    request.save();
    await Promise.all(
      itUsers.map((it) =>
        createITNotification({
          receiverId: it._id,
          requestId: request._id,
          type: "Software Request",
          message: `Provide requested Software to ${user.name}`,
          status: "unread",
        })
      )
    );
    const employeeNotification = createEmployeeNotification({
      receiverId: user._id,
      requestId: request._id,
      type: "Software Request",
      message: "Your software request has been approved by HR",
      status: "unread",
    });

    return res.status(200).json({ request });
  } catch (error) {
    console.error("Error in getNotifications:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const asset_Allocate_IT = async (req, res) => {
  try {
    const { requestId, requested_by, asset_id, user_id } = req.body;

    const request = await AssetRequest.findById(requestId);
    const user = await Employee.findById(requested_by);
    const asset = await Asset.findById(asset_id);

    if (!request) return res.status(404).json({ error: "Request not found" });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!asset) return res.status(404).json({ error: "Asset not found" });

    let expected_return = null;
    if (request.expectedDuration) {
      switch (request.expectedDuration.toLowerCase()) {
        case "3 months":
          expected_return = moment().add(3, "months").toDate();
          break;
        case "6 months":
          expected_return = moment().add(6, "months").toDate();
          break;
        case "1 year":
          expected_return = moment().add(1, "year").toDate();
          break;
        case "permanent":
          expected_return = null;
          break;
        default:
          expected_return = null;
      }
    }

    request.requestStatus = "Asset_Allocated";
    await request.save();

    asset.status = "Assigned";
    asset.assigned_to = user._id;
    await asset.save();

    const newAllocation = new AssetAllocation({
      asset_id: asset._id,
      user_id: user._id,
      request_id: request._id,
      allocated_by: user_id,
      allocation_date: new Date(),
      expected_return: expected_return,
      status: "Allocated",
    });
    await newAllocation.save();

    await createEmployeeNotification({
      receiverId: user._id,
      requestId: request._id,
      type: "Asset Request",
      message: "Your asset has been allocated",
      status: "unread",
    });

    return res
      .status(200)
      .json({ message: "Asset allocated successfully", request, asset });
  } catch (error) {
    console.error("Error in asset_allocate_IT:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const software_Allocate_IT = async (req, res) => {
  try {
    const { requestId, requested_by, user_id } = req.body;

    const request = await SoftwareRequest.findById(requestId);
    const user = await Employee.findById(requested_by);

    if (!request) return res.status(404).json({ error: "Request not found" });
    if (!user) return res.status(404).json({ error: "User not found" });

    request.requestStatus = "Software_Installed";
    request.allocated_by = user_id;
    await request.save();

    await createEmployeeNotification({
      receiverId: user._id,
      requestId: request._id,
      type: "Software Request",
      message: "Software has been installed",
      status: "unread",
    });

    return res
      .status(200)
      .json({ message: "Software installed successfully", request });
  } catch (error) {
    console.error("Error in asset_allocate_IT:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { notId, role } = req.body;
    let notificationModel;
    if (role === "HR") {
      notificationModel = HR_Notification;
    } else if (role === "IT-Person") {
      notificationModel = IT_Notification;
    } else if (role === "Employee") {
      notificationModel = Employee_Notification;
    }

    const updatedNotification = await notificationModel.findByIdAndUpdate(
      notId,
      { status: "read" },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    return res.status(200).json({
      message: "Notification marked as read",
      notification: updatedNotification,
    });
  } catch (error) {
    console.error("Error in getNotifications:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const asset_Reject = async (req, res) => {
  try {
    const { requestId, requested_by, reason, rejected_by } = req.body;
    const request = await AssetRequest.findById({ _id: requestId });
    const user = await Employee.findById(requested_by);
    const hr_user = await Employee.findById(rejected_by);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    request.requestStatus = "Rejected";
    request.save();

    const newRejection = new AssetRejection({
      user_id: user._id,
      request_id: request._id,
      rejected_by: hr_user._id,
      rejection_date: new Date(),
      reason: reason,
    });
    newRejection.save();
    const employeeNotification = createEmployeeNotification({
      receiverId: user._id,
      requestId: request._id,
      type: "Asset Request",
      message: "Your asset request has been rejected by HR",
      status: "unread",
    });

    return res.status(200).json({ request });
  } catch (error) {
    console.error("Error in getNotifications:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const software_Reject = async (req, res) => {
  try {
    const { requestId, requested_by, reason, rejected_by } = req.body;
    const request = await SoftwareRequest.findById({ _id: requestId });
    const user = await Employee.findById(requested_by);
    // const hr_user = await Employee.findById(rejected_by);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    request.requestStatus = "Rejected";
    request.rejection_reason = reason;
    request.rejected_by = rejected_by;
    request.save();

    const employeeNotification = createEmployeeNotification({
      receiverId: user._id,
      requestId: request._id,
      type: "Software Request",
      message: "Your software request has been rejected by HR",
      status: "unread",
    });

    return res.status(200).json({ request });
  } catch (error) {
    console.error("Error in getNotifications:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const get_Rejection = async (req, res) => {
  try {
    const { requestId } = req.body;
    const reject = await AssetRejection.findOne({ request_id: requestId });

    if (!reject) {
      return res.status(404).json({ error: "Rejection not found" });
    }
    return res.status(200).json({ reject });
  } catch (error) {
    console.error("Error in get_Rejection:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const get_Pending = async (req, res) => {
  try {
    const { requestId } = req.body;
    let request = await AssetRequest.findOne({ _id: requestId });

    if (!request) {
      request = await SoftwareRequest.findOne({ _id: requestId });
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }
    }
    return res.status(200).json({ request });
  } catch (error) {
    console.error("Error in get_Rejection:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const asset_Pending = async (req, res) => {
  try {
    const { requestId, requested_by, reason, pending_by } = req.body;

    const it_user = await Employee.findById(pending_by);
    const request = await AssetRequest.findById(requestId);
    if (!it_user) {
      return res.status(404).json({ error: "User not found" });
    }
    request.requestStatus = "Pending_By_IT";
    request.pending_by = pending_by;
    request.pending_reason = reason;
    request.save();
    const employeeNotification = await createEmployeeNotification({
      receiverId: requested_by,
      requestId: requestId,
      type: "Asset Request",
      message: "Your asset request has been pending by IT-Person",
      pending_reason: reason,
      status: "unread",
    });
    console.log("Saved Notification:", employeeNotification);

    return res.status(200).json({ request });
  } catch (error) {
    console.error("Error in getNotifications:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const software_Pending = async (req, res) => {
  try {
    const { requestId, requested_by, reason, pending_by } = req.body;

    const it_user = await Employee.findById(pending_by);
    const request = await SoftwareRequest.findById(requestId);
    if (!it_user) {
      return res.status(404).json({ error: "User not found" });
    }
    request.requestStatus = "Pending_By_IT";
    request.pending_by = pending_by;
    request.pending_reason = reason;
    request.save();
    const employeeNotification = await createEmployeeNotification({
      receiverId: requested_by,
      requestId: requestId,
      type: "Software Request",
      message: "Your software request has been pending by IT-Person",
      pending_reason: reason,
      status: "unread",
    });
    // console.log("Saved Notification:", employeeNotification);

    return res.status(200).json({ request });
  } catch (error) {
    console.error("Error in getNotifications:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const checkSoftwareExpiry = async (req, res) => {
  try {
    const now = Date.now();
    const today = new Date();
    const softwares = await Software.find({ expiration_date: { $lte: today } });

    for (const software of softwares) {
      const lastNotified = software.lastExpiryNotified?.getTime();
      // console.log(software.name)
      if (!lastNotified || (now - lastNotified) / (1000 * 60 * 60 * 24) >= 7) {
        software.lastExpiryNotified = new Date(now);
        await software.save();                                    

        const asset_allocation = await AssetAllocation.findOne({
          asset_id: software.assigned_laptop_id,
        });

        if (asset_allocation) {                                       
          await createEmployeeNotification({              
            receiverId: asset_allocation.user_id,
            assetId: asset_allocation.asset_id,
            type: "Software Expiry",
            message: `Your software ${software.name} has expired`,
            status: "unread",
          });

          await createITNotification({
            receiverId: asset_allocation.allocated_by,
            assetId: asset_allocation.asset_id,
            type: "Software Expiry",
            message: `Software ${software.name} assigned to user has expired`,
            status: "unread",
          });
        }
        else{
          await createITNotification({
            receiverId: software.installed_by,
            assetId: software.assigned_laptop_id,
            type: "Software Expiry",
            message: `Software ${software.name} installed in asset has expired`,
            status: "unread",
          });
       
        }
      }
    }
  } catch (error) {
    console.error("Error in software expiry:", error.message);
  }
};

export const issue_messages = async (req, res) => {
  try {
    const { requestId, requested_by, notification, type, reviewed_by } =
      req.body;

    const it_user = await Employee.findById(reviewed_by);
    let request = await AssetIssue.findById(requestId);
    if (!request) {
      request = await AssetReturn.findById(requestId);
    }
    const asset = await Asset.findById(request.asset_id);
    let message;
    if (!it_user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (type === "reject") {
      if (request.type === "lost") {
        asset.status = "Asset Lost";
      } else {
        asset.status = "Assigned";
      }
      request.requestStatus = "Request Rejected";
      request.rejected_by = reviewed_by;
      request.rejection_reason = notification;
      if (!request.type) {
        message = `Your asset return request has been rejected by IT.`;
      } else {
        message = `Your ${request.type} request has been rejected by IT.`;
      }
    } else {
      // request.requestStatus = "Response";
      request.reviewed_by = reviewed_by;
      request.review_comment = notification;
      if (!request.type) {
        message = `IT has responded to your asset return request. View their message`;
      } else {
        message = `IT has responded to your ${request.type} request. View their message`;
      }
    }
    await request.save();
    await asset.save();
    const employeeNotification = await createEmployeeNotification({
      receiverId: requested_by,
      requestId: requestId,
      type: ["maintenance", "lost"].includes(request.type)
        ? "Asset Issue Request"
        : "Asset Return Request",
      message: message,
      response_msg: notification,
      status: "unread",
    });
    return res.status(200).json({ request });
  } catch (error) {
    console.error("Error in getNotifications:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const underProcess_Issue = async (req, res) => {
  try {
    const { requestId, requested_by, user_id } = req.body;

    const request = await AssetIssue.findById(requestId);
    const user = await Employee.findById(requested_by);
    const asset = await Asset.findById(request.asset_id);
    if (!request) return res.status(404).json({ error: "Request not found" });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (request.type === "lost") {
      request.requestStatus = "Under_Process";
      asset.status = "Under_Process";
    }
    if (request.type === "maintenance") {
      request.requestStatus = "Under_Maintenance";
      asset.status = "Under_Maintenance";
    }
    await asset.save();
    request.reviewed_by = user_id;
    let msg;
    // if (!request.review_comment || request.review_comment.trim() === "") {
    if (request.type === "lost") {
      msg = "IT team is currently investigating the lost asset.";
    } else if (request.type === "maintenance") {
      msg = "Asset is currently under maintenance by the IT team.";
    } else {
      msg = "Issue is currently being processed.";
    }
    // }
    request.review_comment = msg;
    await request.save();

    await createEmployeeNotification({
      receiverId: user._id,
      requestId: request._id,
      type: "Asset Issue Request",
      message: `Your ${request.type} request is now being processed by IT.`,
      response_msg: msg,
      status: "unread",
    });

    return res.status(200).json({ message: "Request Under Process", request });
  } catch (error) {
    console.error("Error in asset_allocate_IT:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const issueSolved_IT = async (req, res) => {
  try {
    const { requestId, requested_by, user_id, status } = req.body;

    const request = await AssetIssue.findById(requestId);
    const user = await Employee.findById(requested_by);
    const asset = await Asset.findById(request.asset_id);
    if (!request) return res.status(404).json({ error: "Request not found" });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (request.type === "lost") {
      if (status === "Asset_Found") {
        asset.status = "Assigned";
      } else {
        asset.status = "Asset Lost";
      }
    }
    if (request.type === "maintenance") {
      asset.status = "Assigned";
    }
    await asset.save();
    let msg;
    request.requestStatus = "Issue_Resolved";
    // if (!request.review_comment || request.review_comment.trim() === "") {
    if (request.type === "lost") {
      msg =
        status === "Asset_Found"
          ? "Asset has been found and reassigned."
          : "Asset could not be recovered and is marked as lost.";
    } else if (request.type === "maintenance") {
      msg = "Maintenance completed and asset is ready for use.";
    } else {
      msg = "Issue resolved by IT.";
    }
    // }
    request.review_comment = msg;
    request.reviewed_by = user_id;
    await request.save();
    await createEmployeeNotification({
      receiverId: user._id,
      requestId: request._id,
      type: "Asset Issue Request",
      message: `Your ${request.type} request is resolved.`,
      response_msg: msg,
      status: "unread",
    });
    return res
      .status(200)
      .json({ message: "Issue resolved successfully", request });
  } catch (error) {
    console.error("Error in asset_allocate_IT:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const underMaintenance = async (req, res) => {
  try {
    const { requestId, requested_by, user_id } = req.body;

    const request = await AssetReturn.findById(requestId);
    const user = await Employee.findById(requested_by);
    const asset = await Asset.findById(request.asset_id);
    if (!request) return res.status(404).json({ error: "Request not found" });
    if (!user) return res.status(404).json({ error: "User not found" });

    request.requestStatus = "Under_Maintenance";
    asset.status = "Under_Maintenance";

    await asset.save();
    request.reviewed_by = user_id;
    let msg;

    msg = "Asset is currently under maintenance by the IT team.";

    request.review_comment = msg;
    await request.save();

    await createEmployeeNotification({
      receiverId: user._id,
      requestId: request._id,
      type: "Asset Return Request",
      message: `Your asset return request is now being processed by IT.`,
      response_msg: msg,
      status: "unread",
    });

    return res.status(200).json({ message: "Request Under Process", request });
  } catch (error) {
    console.error("Error in asset_allocate_IT:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const return_confirm = async (req, res) => {
  try {
    const { requestId, requested_by, user_id } = req.body;

    const request = await AssetReturn.findById(requestId);
    const user = await Employee.findById(requested_by);
    const asset = await Asset.findById(request.asset_id);
    if (!request) return res.status(404).json({ error: "Request not found" });
    if (!user) return res.status(404).json({ error: "User not found" });
    await AssetAllocation.findOneAndDelete({asset_id : request.asset_id})
    asset.status = "Not Assigned";
    await asset.save();
    let msg;
    request.requestStatus = "Return_Completed";

    msg = "The return process has been completed.";

    request.review_comment = msg;
    request.reviewed_by = user_id;
    await request.save();
    await createEmployeeNotification({
      receiverId: user._id,
      requestId: request._id,
      type: "Asset Return Request",
      message: `Your asset return request is completed.`,
      response_msg: msg,
      status: "unread",
    });
    return res
      .status(200)
      .json({ message: "Asset Return successfully", request });
  } catch (error) {
    console.error("Error in return_confirm:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
