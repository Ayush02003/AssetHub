import HR_Notification from "../models/hr_notificationModel.js";
import IT_Notification from "../models/it_notificationModel.js";
import Employee_Notification from "../models/employee_notificationModel.js";
export const createHRNotification = async ({
  receiverId,
  requestId,
  type,
  message,
  status,
}) => {
  try {
    const notification = new HR_Notification({
      receiverId,
      requestId,
      type,
      message,
      status,
    });
    await notification.save(); 
    console.log("HR_Notification Created:", notification);
    return notification;
  } catch (error) { 
    console.error("Error creating notification:", error);
    throw error;
  }
};

export const createITNotification = async ({
  receiverId,
  assetId,
  requestId,
  type,
  message,
  status,
}) => {
  try {
    const notification = new IT_Notification({
      receiverId,
      assetId,
      requestId,
      type,
      message,
      status,
    });
    await notification.save(); 
    return notification;
  } catch (error) { 
    console.error("Error creating notification:", error);
    throw error;
  }
};

export const createEmployeeNotification = async ({
  receiverId,
  assetId,
  requestId,
  type,
  message,
  response_msg,
  status,
  pending_reason
}) => {
  try {
    const notification = new Employee_Notification({
      receiverId,
      assetId,
      requestId,
      type,
      message,
      response_msg,
      pending_reason,
      status,
    });
    await notification.save(); 
    return notification;
  } catch (error) { 
    console.error("Error creating notification:", error);
    throw error;
  }
};
