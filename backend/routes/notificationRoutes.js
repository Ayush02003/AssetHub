import express from "express";
import {
  getNotification,
  asset_Approve_HR,
  software_Approve,
  updateStatus,
  get_Pending,
  asset_Allocate_IT,
  software_Allocate_IT,
  asset_Reject,
  software_Reject,
  asset_Pending,
  software_Pending,
  get_Rejection,

  issueSolved_IT,
  issue_messages,
  underProcess_Issue,
  underMaintenance,
  return_confirm
} from "../controller/notificationController.js";
const router = express.Router();

router.post("/get_notification", getNotification);
router.post("/asset_approve_hr", asset_Approve_HR);
router.post("/software_approve", software_Approve);
router.post("/update_status", updateStatus);
router.post("/asset_allocate_it", asset_Allocate_IT);
router.post("/software_allocate_it", software_Allocate_IT);
router.post("/asset_reject", asset_Reject);
router.post("/software_reject", software_Reject);
router.post("/get_rejection", get_Rejection);
router.post("/asset_pending", asset_Pending);
router.post("/software_pending", software_Pending);
router.post("/get_pending", get_Pending);
router.post("/send_notification", issue_messages);
router.post("/underProcess_IT", underProcess_Issue);
router.post("/issueSolved_IT", issueSolved_IT);
router.post("/return_confirm", return_confirm);

router.post("/underMaintenance_IT", underMaintenance);
// router.post("/logout",logout)
export default router;
