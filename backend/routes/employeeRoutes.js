import express from "express"
import {addEmployee,getEmployee,updateDesignation, updateEmployee, updatePassword, updateDepartment} from "../controller/employeeController.js"

import protectRoute from "../middleware/protectRoute.js"
const router = express.Router()

router.post("/add_employee",protectRoute,addEmployee) 
router.get("/get_employee",getEmployee)
router.put("/update_designation",updateDesignation)
router.put("/update_department",updateDepartment)
router.put("/update_employee",updateEmployee)
router.put("/update_password",updatePassword)

// router.post("/delete_employee",protectRoute,addEmployee)
export default router; 