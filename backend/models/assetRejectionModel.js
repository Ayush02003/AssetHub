import mongoose from "mongoose";

const assetRejectionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    request_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Asset_Request",
        required: true,
    },
    rejected_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    rejection_date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    reason : {
        type:String,
        required : true,
    }
  },
  { timestamps: true }
);

const AssetRejection = mongoose.model(
  "Asset_Rejection",
  assetRejectionSchema
);

export default AssetRejection;
