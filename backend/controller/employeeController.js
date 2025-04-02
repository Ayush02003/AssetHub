import Employee from "../models/employeeModel.js";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";

export const addEmployee = async (req, res) => {
  try {
    const { name, email, mobile, department, designation, address } = req.body;

    if (!name || !email || !mobile || !department || !designation || !address) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newEmployee = new Employee({
      name,
      email,
      mobile,
      department,
      designation,
      address,
    });

    let generatedPassword = Math.random().toString(36).slice(-8);
    console.log(generatedPassword);

    const hashedPassword = await bcrypt.hash(generatedPassword, 10);
    newEmployee.password = hashedPassword;
    await newEmployee.save();

    let emailMessage = `Hello ${name},\n\nWelcome to Codeflix Web!\n\nYour designation is ${designation} in the ${department} department.`;

    if (designation === "HR" && department === "All") {
      emailMessage += `\n\nAs an HR, you now have the authority to manage all departments within the company.`;
    } else if (designation === "IT-Person" && department === "All") {
      emailMessage += `\n\nAs an IT-Person, you have access to handle all IT-related operations across all departments.`;
    }

    emailMessage += `\n\nHere are your login details:\nUsername: ${email}\nPassword: ${generatedPassword}\n\nBest Regards,\nCodeflix Web`;

    await sendEmail(email, "Welcome to Codeflix Web - Employee Registration", emailMessage);

    return res.status(201).json({
      message: "Employee added and email sent successfully!",
      emp: newEmployee,
    });
  } catch (error) {
    console.error("Error in addEmployee:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getEmployee = async (req, res) => {
  try {
    const employees = await Employee.find();
    return res.status(200).json({ employees });
  } catch (error) {
    console.error("Error in getEmployee:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const updateEmployee = async (req, res) => {
  try {
    const updateData = req.body;

    const updatedEmployee = await Employee.findOneAndUpdate(
      { _id: updateData.id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json({
      message: "Employee updated successfully!",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("Error in updateEmployee:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const updatePassword = async (req, res) => {
  try {
    const passwordData = req.body;
    const { username } = req.body;
    const employee = await Employee.findOne({ email: username });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    const isMatch = await bcrypt.compare(
      passwordData.oldPassword,
      employee.password
    );
    if (!isMatch) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }
    const hashedPassword = await bcrypt.hash(passwordData.newPassword, 10);

    employee.password = hashedPassword;
    await employee.save();
    return res.status(200).json({
      message: "password updated successfully!",
    });
  } catch (error) {
    console.log(error);
  }
};
export const updateDesignation = async (req, res) => {
  try {
    const { userId, newDesignation } = req.body;

    const employee = await Employee.findById(userId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employee.designation = newDesignation;
    await employee.save();

    let emailMessage = `Hello ${employee.name},\n\nYour designation has been updated to ${newDesignation} in the ${employee.department} department.`;

    if (newDesignation === "HR" && employee.department === "All") {
      emailMessage += `\n\nAs an HR, you now have access to manage all departments in the company.`;
    } else if (
      newDesignation === "IT-Person" &&
      employee.department === "All"
    ) {
      emailMessage += `\n\nAs an IT-Person, you now have access to manage all IT-related tasks across all departments.`;
    }

    emailMessage += `\n\nBest Regards,\nCodeflix Web`;

    await sendEmail(
      employee.email,
      "Designation Update Notification",
      emailMessage
    );

    return res
      .status(200)
      .json({ message: "Designation updated successfully" });
  } catch (error) {
    console.error("Error in updateDesignation:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { userId, newDepartment } = req.body;

    const employee = await Employee.findById(userId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employee.department = newDepartment;
    await employee.save();

    let emailMessage = `Hello ${employee.name},\n\nYour department has been updated to ${newDepartment}.`;

    if (newDepartment === "All" && employee.designation === "HR") {
      emailMessage += `\n\nAs an HR, you now have access to manage all employees in the company.`;
    } else if (employee.designation === "IT-Person") {
      emailMessage += `\n\nAs an IT-Person, You will now be handling tasks related to the ${newDepartment} department.`;
    }

    emailMessage += `\n\nBest Regards,\nCodeflix Web`;

    await sendEmail(
      employee.email,
      "Department Update Notification",
      emailMessage
    );

    return res.status(200).json({ message: "Department updated successfully" });
  } catch (error) {
    console.error("Error in updateDepartment:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
