import express from "express"
import { addDept, getDept,addAssetType, getAssetTypes, updateDept, updateAssetType } from "../controller/companyController.js";
const router = express.Router()

router.post("/add_dept",addDept)
router.put("/update_dept",updateDept)
router.post("/add_assetType",addAssetType)
router.get("/get_assetType",getAssetTypes)
router.put("/update_assetType",updateAssetType)
router.get("/get_dept",getDept)
export default router; 