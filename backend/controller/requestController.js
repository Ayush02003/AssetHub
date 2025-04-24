import AssetRequest from "../models/assetRequestModel.js";
import SoftwareRequest from "../models/softwareRequestModel.js";
import AssetIssue from "../models/assetIssueModel.js";
import AssetReturn from "../models/assetReturnModel.js";
import Employee from "../models/employeeModel.js";
import {
  createHRNotification,
  createITNotification,
} from "../utils/createNotification.js";

export const assetRequest = async (req, res) => {
  try {
    const {
      assetType,
      requested_by,
      specifications,
      softwareRequirements,
      assetNeed,
      expectedDuration,
      address,
    } = req.body;

    if (
      !assetType ||
      !requested_by ||
      !specifications ||
      !assetNeed ||
      !expectedDuration ||
      !address
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await Employee.findById(requested_by);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let hrUsers = await Employee.find({
      department: user.department,
      designation: "HR",
    });

    if (hrUsers.length === 0) {
      hrUsers = await Employee.find({ department: "All", designation: "HR" });
    }
    if (hrUsers.length === 0) {
      return res
        .status(404)
        .json({ error: "No HR found to process this request" });
    }
    const newAssetRequest = new AssetRequest({
      assetType,
      requested_by,
      specifications,
      softwareRequirements,
      assetNeed,
      expectedDuration,
      address,
    });

    await newAssetRequest.save();

    await Promise.all(
      hrUsers.map((hr) =>
        createHRNotification({
          receiverId: hr._id,
          requestId: newAssetRequest._id,
          type: "Asset Request",
          message: `New asset request from ${user.name}`,
          status: "unread",
        })
      )
    );

    return res.status(201).json({
      message: "Asset Request added successfully",
      asset: newAssetRequest,
    });
  } catch (error) {
    console.error("Error in assetRequest:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const assetSoftwareRequest = async (req, res) => {
  try {
    const {
      assignedLaptopId,
      requested_by,
      name,
      version,
      software_purpose,
      expected_duration,
    } = req.body;

    if (
      !assignedLaptopId ||
      !requested_by ||
      !name ||
      !version ||
      !software_purpose ||
      !expected_duration
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await Employee.findById(requested_by);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let hrUsers = await Employee.find({
      department: user.department,
      designation: "HR",
    });

    if (hrUsers.length === 0) {
      hrUsers = await Employee.find({ department: "All", designation: "HR" });
    }

    if (hrUsers.length === 0) {
      return res
        .status(404)
        .json({ error: "No HR found to process this request" });
    }

    const newSoftwareRequest = new SoftwareRequest({
      requested_by,
      asset_id: assignedLaptopId,
      name: name,
      version: version,
      softwarePurpose: software_purpose,
      expectedDuration: expected_duration,
    });

    await newSoftwareRequest.save();

    await Promise.all(
      hrUsers.map((hr) =>
        createHRNotification({
          receiverId: hr._id,
          requestId: newSoftwareRequest._id,
          type: "Software Request",
          message: `New software request from ${user.name}`,
          status: "unread",
        })
      )
    );

    return res.status(201).json({
      message: "Software request submitted successfully",
      request: newSoftwareRequest,
    });
  } catch (error) {
    console.error("Error in assetSoftwareRequest:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addAssetIssue = async (req, res) => {
  try {
    const { assignedLaptopId, type, description, requested_by, file, lost_date } = req.body;

    if (!assignedLaptopId || !type || !description || !requested_by) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const user = await Employee.findById(requested_by);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    let itUsers = await Employee.find({
      department: user.department,
      designation: "IT-Person",
    });

    if (itUsers.length === 0) {
      itUsers = await Employee.find({
        department: "All",
        designation: "IT-Person",
      });
    }

    if (itUsers.length === 0) {
      return res
        .status(404)
        .json({ error: "No IT personnel found to handle the request." });
    }

    const newAssetIssue = new AssetIssue({
      requested_by,
      asset_id: assignedLaptopId,
      type,
      description,
      file,
      lost_date,
    });

    await newAssetIssue.save();

    await Promise.all(
      itUsers.map((it) =>
        createITNotification({
          receiverId: it._id,
          requestId: newAssetIssue._id,               
          type: "Asset Issue Request",
          message: `New ${type} request from ${user.name}`,
          status: "unread",
        })
      )
    );

    return res.status(201).json({
      message: `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } request submitted successfully.`,
      request: newAssetIssue,
    });
  } catch (error) {
    console.error("Error in addAssetIssue:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};





export const addAssetReturn = async (req, res) => {
  try {
    const { assignedLaptopId, condition, return_reason, requested_by } = req.body;

    if (!assignedLaptopId || !condition || !return_reason || !requested_by) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const user = await Employee.findById(requested_by);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    let itUsers = await Employee.find({
      department: user.department,
      designation: "IT-Person",
    });

    if (itUsers.length === 0) {
      itUsers = await Employee.find({
        department: "All",
        designation: "IT-Person",
      });
    }

    if (itUsers.length === 0) {
      return res
        .status(404)
        .json({ error: "No IT personnel found to handle the request." });
    }

    const newAssetIssue = new AssetReturn({
      requested_by,
      asset_id: assignedLaptopId,
      condition,
      return_reason,
    });

    await newAssetIssue.save();

    await Promise.all(
      itUsers.map((it) =>
        createITNotification({
          receiverId: it._id,
          requestId: newAssetIssue._id,               
          type: "Asset Return Request",
          message: `New asset return request from ${user.name}`,
          status: "unread",
        })
      )
    );
                                    
    return res.status(201).json({
      message: `Asset return request submitted successfully.`,
      request: newAssetIssue,
    });
  } catch (error) {
    console.error("Error in addAssetIssue:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
