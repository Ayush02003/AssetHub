import mongoose from "mongoose";

const deptSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
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

const Department = mongoose.model("Department", deptSchema);

export default Department;
