import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      default: "unread",
      required: true,
    },
    pending_reason : {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Employee_Notification = mongoose.model("employee_notification", notificationSchema);

export default Employee_Notification;
