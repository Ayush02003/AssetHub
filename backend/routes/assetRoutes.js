import express from "express";
import {
  addAsset,
  getAsset,
  getUserAsset,
  allocatedAsset,
  softwareAsset,
  allocatedAssetUser,
  allocatedAssetUserByAssetId,
  updateAsset,
  updateSoftware,
  getAssetById,
} from "../controller/assetController.js";
import { addSoftware, getSoftware } from "../controller/softwareController.js";
import protectRoute from "../middleware/protectRoute.js";
import {
  assetRequest,
  assetSoftwareRequest,
  addAssetIssue,
  addAssetReturn
} from "../controller/requestController.js";
const router = express.Router();

router.post("/add_asset", protectRoute, addAsset);
router.get("/get_asset", getAsset);
router.get("/get_user_asset", getUserAsset);
router.get("/get_asset_by_id", getAssetById);
router.post("/add_software", addSoftware);
router.get("/get_installed_software", getSoftware);
router.post("/add_request", assetRequest);
router.post("/add_software_request", assetSoftwareRequest);
router.post("/add_asset_issue", addAssetIssue);
router.post("/asset_return", addAssetReturn);

router.get("/allocated_asset", allocatedAsset);
router.get("/software_asset", softwareAsset);
router.get("/allocated_asset_user", allocatedAssetUser);
router.get("/allocatedAsset_UserBy_AssetId", allocatedAssetUserByAssetId);
// router.post("/get_asset",protectRoute,getAsset)

router.put("/update_asset", updateAsset);
router.put("/update_software", updateSoftware);
export default router;
