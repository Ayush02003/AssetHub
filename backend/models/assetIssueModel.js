import mongoose from "mongoose";

const assetIssueSchema = new mongoose.Schema(
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
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    lost_date: {
        type: Date,
    },
    file: {
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

const AssetIssue = mongoose.model("Asset_Issue", assetIssueSchema);

export default AssetIssue;
