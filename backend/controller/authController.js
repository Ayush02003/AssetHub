import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import Employee from "../models/employeeModel.js";
export const login = async (req, res) => {
  try {
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
