import AssetRequest from "../models/assetRequestModel.js";
import Employee from "../models/employeeModel.js";
import { createHRNotification } from "../utils/createNotification.js";

export const assetRequest = async (req, res) => {
  try {
    const { 
      assetType, 
      requested_by, 
      specifications,             
      softwareRequirements,       
      assetNeed, 
      expectedDuration, 
      address 
    } = req.body;

    if (!assetType || !requested_by || !specifications || !assetNeed || !expectedDuration || !address) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await Employee.findById(requested_by);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let hrUsers = await Employee.find({ department: user.department, designation: "HR" });

    if (hrUsers.length === 0) {
      hrUsers = await Employee.find({ department: "All", designation: "HR" });
    }
    if (hrUsers.length === 0) {
      return res.status(404).json({ error: "No HR found to process this request" });
    }    
    const newAssetRequest = new AssetRequest({
      assetType,
      requested_by,
      specifications,
      softwareRequirements,
      assetNeed,
      expectedDuration,
      address 
    });

    await newAssetRequest.save();

    await Promise.all(
      hrUsers.map(hr => 
        createHRNotification({
          receiverId: hr._id, 
          requestId: newAssetRequest._id,
          type: "Asset Request",
          message: `New asset request from ${user.name}`,
          status: "Pending",
        })
      )
    );

    return res.status(201).json({ message: "Asset Request added successfully", asset: newAssetRequest });
  } catch (error) {
    console.error("Error in assetRequest:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
