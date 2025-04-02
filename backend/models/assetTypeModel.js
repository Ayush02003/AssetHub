import mongoose from "mongoose";

const assetTypeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      // unique: true, 
      trim: true,   
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"], 
      default: "Active",
    },
  },
  { timestamps: true }
);

const AssetType = mongoose.model("Asset_Type", assetTypeSchema);

export default AssetType;
