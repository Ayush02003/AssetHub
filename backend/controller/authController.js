import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import Employee from "../models/employeeModel.js";
import sendEmail from "../utils/sendEmail.js";
import { checkSoftwareExpiry } from "../controller/notificationController.js"

const otpStore = {};

export const login = async (req, res) => {
  try {
    checkSoftwareExpiry()
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (role === "Admin") { 
      if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
      ) {
        generateTokenAndSetCookie("Admin", res);
        return res.status(200).json({
          username: process.env.ADMIN_USERNAME,
          role: "Admin",
          dept:"General"
        });
      } else {
        return res.status(400).json({ error: "Invalid credentials" });
      }
    }
    // if (
    //   username === process.env.HR_USERNAME &&
    //   password === process.env.HR_PASSWORD
    // ) {
    //   generateTokenAndSetCookie("HR", res);
    //   return res.status(200).json({
    //     username: process.env.HR_USERNAME,
    //     role: "HR",
    //   });
    // } 
    const user = await Employee.findOne({ email :username,designation : role });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isPassCorrect = await bcrypt.compare(password, user.password);
    if (!isPassCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    generateTokenAndSetCookie(user.role, res);
    return res.status(200).json({
      id:user._id,
      username: username,
      role: role,
      dept : user.department
    });
   } catch (error) { 
    console.error("Error in Login: ", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged Out Successfully" });
  } catch (error) {
    console.log("Error in Logout : ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const send_otp = async (req, res) => {
  try {
    const { username } = req.body; 
    const user = await Employee.findOne({ email :username });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    if (!username) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[username] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };
    const emailMessage = `Your One Time Verification Password is ${otp}.\nIt expires in 5 minutes.`;

    await sendEmail(username, "Codeflix Web - OTP Verification", emailMessage);

    res.status(200).json({ success: true, success : "OTP sent successfully!"});
  } catch (error) {
    // console.error("Error sending OTP:", error.message); 
    res.status(500).json({ success: false, message: "Failed to send OTP"});
  }
};

export const verify_otp = (req, res) => {
  const { username, otp } = req.body;
// console.log(otpStore[username])
  if (!username || !otp) {
    return res.status(400).json({ success: false, error: "Username and OTP are required" });
  }
  const storedOTP = otpStore[username]; 
 
  if (String(storedOTP.otp) !== String(otp))  {
    return res.status(400).json({ success: false, error: "Invalid OTP" });
  }

  if (Date.now() > storedOTP.expiresAt) {
    return res.status(400).json({ success: false, error: "OTP has expired" });
  }

  delete otpStore[username]; 

  return res.status(200).json({ success: true, message: "OTP verified successfully" });
};

export const reset_password = async (req, res) => {
  try {
    const { username, newPassword } = req.body;
    if (!username || !newPassword) {
      return res.status(400).json({ error: "Username and new password are required" });
    }
    const employee = await Employee.findOne({ email: username });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    employee.password = hashedPassword;
    await employee.save();
    return res.status(200).json({
      success:true,
      message: "password updated successfully!",
    });
  } catch (error) {
    console.log(error);
  }
};