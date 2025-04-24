import mongoose from "mongoose";

const assetReturnSchema = new mongoose.Schema(
  {
    requested_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    asset_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },
    condition: {
      type: String,
      required: true,
    },
    return_reason: {
        type: String,
        required: true,
      },
    requestStatus: {
      type: String,
      default: "Pending",
    },
    reviewed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    review_comment: {
      type: String,
    },
    rejected_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    rejection_reason: {
      type: String,
    }
  },
  { timestamps: true }
);

const AssetReturn = mongoose.model("Asset_Return", assetReturnSchema);

export default AssetReturn;
