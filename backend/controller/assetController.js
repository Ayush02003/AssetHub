import Asset from "../models/assetModel.js";
import AssetRequest from "../models/assetRequestModel.js";
import AssetAllocation from "../models/assetAllocationModel.js";
import Employee from "../models/employeeModel.js";
import Software from "../models/softwareModel.js";
export const addAsset = async (req, res) => {
  try {
    const {
      name,
      type,
      serial_num,
      price,
      desc,
      brand,
      purchase_date,
      warranty_exp,
      pic1,
      pic2,
    } = req.body;

    if (
      !name ||
      !type ||
      !desc ||
      !price ||
      !brand ||
      !purchase_date ||
      !warranty_exp ||
      !pic1 ||
      !pic2
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newAsset = new Asset({
      name,
      type,
      serial_num,
      price,
      desc,
      brand,
      purchase_date,
      warranty_exp,
      pic1,
      pic2,
    });

    await newAsset.save();

    return res
      .status(201)
      .json({ message: "Asset added successfully", asset: newAsset });
  } catch (error) {
    console.error("Error in addAsset:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAsset = async (req, res) => {
  try {
    const assets = await Asset.find();
    return res.status(200).json({ assets });
  } catch (error) {
    console.error("Error in getAssets:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getUserAsset = async (req, res) => {
  try {
    const userId = req.query.user_id;
    const assets = [];

    const allocations = await AssetAllocation.find({ user_id: userId });

    for (const allocation of allocations) {
      const asset = await Asset.findById(allocation.asset_id);
      if (asset) {
        assets.push(asset); 
      }
    }

    return res.status(200).json({ assets });
  } catch (error) {
    console.error("Error in getUserAsset:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getAssetById = async (req, res) => {
  try {
    const assetId = req.query.asset_id;
    const asset = await Asset.findById(assetId);

    return res.status(200).json({ asset });
  } catch (error) {
    console.error("Error in getAssets:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const allocatedAsset = async (req, res) => {
  try {
    const { requestId } = req.query;
    const request = await AssetAllocation.findOne({ request_id: requestId }); 
    if (!request) {
      return res.status(404).json({ error: "Asset allocation not found." });
    }
    const asset = await Asset.findOne({ _id: request.asset_id });
    if (!asset)  { 
      return res.status(404).json({ error: "Asset not found." });
    }
    return res.status(200).json({ asset });
  } catch (error) {
    console.error("Error in getAssets:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const softwareAsset = async (req, res) => {
  try {
    const { assetId } = req.query;
    const asset = await Asset.findOne({ _id: assetId });
    if (!asset)  {
      return res.status(404).json({ error: "Asset not found." });
    } 
    return res.status(200).json({ asset }); 
  } catch (error) {
    console.error("Error in getAssets:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const allocatedAssetUser = async (req, res) => {
  try {
    const { userId } = req.query;

    const allocatedAssets = await AssetAllocation.find({ user_id: userId });

    if (!allocatedAssets || allocatedAssets.length === 0) {
      return res
        .status(404) 
        .json({ error: "No assets allocated to this user." });
    }

    const assets = await Asset.find({
      _id: { $in: allocatedAssets.map((allocation) => allocation.asset_id) },
    });

    if (!assets || assets.length === 0) {
      return res.status(404).json({ error: "Assets not found." });
    }

    return res.status(200).json({ assets });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Server error", details: error.message });
  }
};


export const allocatedAssetUserByAssetId = async (req, res) => {
  try {
    const { assetId } = req.query;
    const allocation = await AssetAllocation.findOne({ asset_id: assetId });
    if (!allocation || allocation.length === 0) {
      return res
        .status(404) 
        .json({ error: "No assets allocated to this user." });
    } 
    const user = await Employee.findOne({ 
      _id: allocation.user_id 
    });
    if (!user || user.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Server error", details: error.message });
  }
};

export const updateAsset = async (req, res) => {
  try {
    const updateData = req.body;

    const updatedAsset = await Asset.findOneAndUpdate(
      { _id: updateData.id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedAsset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    return res.status(200).json({
      message: "Asset updated successfully!",
      asset: updatedAsset,
    });
  } catch (error) {
    console.error("Error in updateAsset:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateSoftware = async (req, res) => {
  try {
    const updateData = req.body;
    // console.log(updateData.id)
    const updatedSoftware = await Software.findOneAndUpdate(
      { _id: updateData.id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedSoftware) {
      return res.status(404).json({ message: "Software not found" });
    }

    return res.status(200).json({
      message: "Software updated successfully!",
      software: updatedSoftware,
    }); 
  } catch (error) {
    console.error("Error in updateSoftware:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


