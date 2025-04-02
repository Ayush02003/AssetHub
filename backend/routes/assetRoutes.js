import express from "express"
import {addAsset,getAsset, allocatedAsset, allocatedAssetUser,allocatedAssetUserByAssetId, updateAsset, updateSoftware} from "../controller/assetController.js"
import {addSoftware,getSoftware} from "../controller/softwareController.js"
import protectRoute from "../middleware/protectRoute.js"
import { assetRequest } from "../controller/requestController.js"
const router = express.Router()

router.post("/add_asset",protectRoute,addAsset)
router.get("/get_asset",getAsset)
router.post("/add_software",addSoftware)
router.get("/get_installed_software",getSoftware)
router.post("/add_request",assetRequest)
router.get("/allocated_asset",allocatedAsset)
router.get("/allocated_asset_user",allocatedAssetUser)
router.get("/allocatedAsset_UserBy_AssetId",allocatedAssetUserByAssetId)   
// router.post("/get_asset",protectRoute,getAsset)
 
router.put("/update_asset",updateAsset)
router.put("/update_software",updateSoftware)
export default router;              

