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
  },
  { timestamps: true }
);

const HR_Notification = mongoose.model("hr_notification", notificationSchema);

export default HR_Notification;
