import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      default: null,
    },
    mobile: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 10,
    },
    department: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
