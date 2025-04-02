import mongoose from "mongoose";

const softwareSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        version: {
            type: String,
            required: true,
        },
        license_type: {
            type: String,
            enum: ["Free", "Paid", "Trial"], 
            required: true,
        },
        license_key: {
            type: String,
            required: function () {
                return this.license_type !== "Free"; 
            },
        },
        expiration_date: {
            type: Date,
            required: function () {
                return this.license_type === "Paid" || this.license_type === "Trial"; 
            },
        },
        installation_type: {
            type: String,
            enum: ["Pre-Installed", "Installed on Request"],
            required: true,
        },
        assigned_laptop_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Asset", 
            required: true,
        },
        installed_by:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee", 
            required: true,
        }

    },
    { timestamps: true }
);

const Software = mongoose.model("Software", softwareSchema);

export default Software;
