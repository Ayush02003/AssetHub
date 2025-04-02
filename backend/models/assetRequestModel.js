import mongoose from "mongoose";

const assetRequestSchema = new mongoose.Schema(
  {
    requested_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    assetType: {
      type: String,
      required: true,
    },
    specifications: {
      type: String,
      required: true,
    },
    softwareRequirements: {
      type: String,
      required: false,
    },
    assetNeed: {
      type: String,
      required: true,
    },
    expectedDuration: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    requestStatus: {
      type: String,
      default: "Pending",
    },
    pending_by : {
      type: String,
      required: false,
    },
    pending_reason : {
      type: String,
      required: false,
    }
  },
  { timestamps: true }
);

const AssetRequest = mongoose.model("Asset_Request", assetRequestSchema);

export default AssetRequest;
