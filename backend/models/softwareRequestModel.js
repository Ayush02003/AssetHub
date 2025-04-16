import mongoose from "mongoose";

const softwareRequestSchema = new mongoose.Schema(
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
    name: {
      type: String,
      required: true,
    },
    version: {
      type: String,
      required: true,
    },
    softwarePurpose: {
      type: String,
      required: true,
    },
    expectedDuration: {
      type: String,
      required: true,
    },
    allocated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    // approved_by: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Employee",
    // },
    requestStatus: {
      type: String,
      default: "Pending",
    },
    pending_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    pending_reason: {
      type: String,
    },
    rejection_reason: {
      type: String,
    },
    rejected_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    }
  },
  { timestamps: true }
);

const SoftwareRequest = mongoose.model("Software_Request", softwareRequestSchema);

export default SoftwareRequest;
