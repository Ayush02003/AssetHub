import mongoose from "mongoose";

const assetAllocationSchema = new mongoose.Schema(
  {
    asset_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    allocated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    request_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset_Request",
      required: true,
    },
    allocation_date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    expected_return: {
      type: Date,
      default: null, // Null if allocation is permanent
    },
    status: {
      type: String,
      enum: ["Allocated", "Returned", "Expired"],
      default: "Allocated",
    },
  },
  { timestamps: true }
);

const AssetAllocation = mongoose.model(
  "Asset_Allocation",
  assetAllocationSchema
);

export default AssetAllocation;
