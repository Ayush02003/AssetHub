import Department from "../models/departmentModel.js";
import AssetType from "../models/assetTypeModel.js";
export const addDept = async (req, res) => {
  try {
    const { departmentName, description,status } = req.body;

    if (!departmentName || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const existingDept = await Department.findOne({
      name: { $regex: new RegExp(`^${departmentName}$`, "i") },
    });
    if (existingDept) {
      return res.status(400).json({ error: "Department already exists" });
    }
    const newDepartment = new Department({
      name: departmentName,
      desc: description,
      status,
    });

    await newDepartment.save();

    return res
      .status(201)
      .json({ message: "Department added successfully", dept: newDepartment });
  } catch (error) {
    console.error("Error in addDept:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getDept = async (req, res) => {
  try {
    const dept = await Department.find();
    return res.status(200).json({ dept });
  } catch (error) {
    console.error("Error in getDepartment:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateDept = async (req, res) => {
  try {
    const { status, deptId } = req.body;

    if (!deptId) {
      return res.status(400).json({ error: "Department ID is required" });
    }

    const dept = await Department.findById(deptId);

    if (!dept) {
      return res.status(404).json({ error: "Department not found" });
    }

    dept.status = status;
    await dept.save();

    return res.status(200).json({ dept });
  } catch (error) {
    console.error("Error in updateDept:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateAssetType = async (req, res) => {
  try {
    const { status, assetId } = req.body;

    if (!assetId) {
      return res.status(400).json({ error: "Asset ID is required" });
    }

    const asset_type = await AssetType.findById(assetId);

    if (!asset_type) {
      return res.status(404).json({ error: "Asset Type not found" });
    }

    asset_type.status = status;
    await asset_type.save();

    return res.status(200).json({ asset_type });
  } catch (error) {
    console.error("Error in updateDept:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addAssetType = async (req, res) => {
  try {
    const { type, description, status } = req.body;  

    if (!type || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const existingAssetType = await AssetType.findOne({
      type: { $regex: new RegExp(`^${type}$`, "i") },
    });

    if (existingAssetType) {
      return res.status(400).json({ error: "Asset Type already exists" });
    }

    const newAssetType = new AssetType({
      type,  
      description,
      status: status || "Active",
    });

    await newAssetType.save();

    return res.status(201).json({
      message: "Asset Type added successfully",
      assetType: newAssetType,
    });

  } catch (error) {
    console.error("Error in addAssetType:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getAssetTypes = async (req, res) => {
  try {
    const assetTypes = await AssetType.find();
    return res.status(200).json({ assetTypes });
  } catch (error) {
    console.error("Error in getAssetTypes:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
