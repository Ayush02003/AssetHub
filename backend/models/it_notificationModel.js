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
      required: false,
    },
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: false,
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

const IT_Notification = mongoose.model("it_notification", notificationSchema);

export default IT_Notification;
