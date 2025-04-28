import express from "express"
import { login,logout, send_otp, verify_otp, reset_password, getRequest, getIssue, getDeptAllocation } from "../controller/authController.js"

const router = express.Router()

router.post("/login",login)
router.post("/forgot_password/send_otp",send_otp)
router.post("/forgot_password/verify_otp",verify_otp)
router.post("/forgot_password/reset_password",reset_password)
router.post("/logout",logout)

router.get("/requests",getRequest)
router.get("/issues",getIssue)
router.get("/getDeptAllocation",getDeptAllocation)
export default router; 