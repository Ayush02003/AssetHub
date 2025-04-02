import HR_Notification from "../models/hr_notificationModel.js";
import IT_Notification from "../models/it_notificationModel.js";
import AssetRejection from "../models/assetRejectionModel.js";
import Employee_Notification from "../models/employee_notificationModel.js";
import AssetRequest from "../models/assetRequestModel.js";
import Asset from "../models/assetModel.js";
import Employee from "../models/employeeModel.js";
import AssetAllocation from "../models/assetAllocationModel.js";
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
    const requests = await AssetRequest.find({ _id: { $in: requestIds } });

    return res.status(200).json({ notifications, requests });
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
    const request = await AssetRequest.findOne({ _id: requestId });
 
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
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