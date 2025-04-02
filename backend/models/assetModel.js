import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        serial_num: {
            type: String,
            required: true,
        },
        price:{
            type:String,
            required: true,
        },
        desc: {
            type:String,
            required: true,
        }, 
        brand: {
            type: String,
            required: true,
        },
        purchase_date: {
            type: Date,
            required: true,
        },
        warranty_exp: {
            type: Date,
            required: true,
        },
        pic1: {
            type: String, 
            required: true,
        },
        pic2: {
            type: String, 
            required: true,
        },
        status: {
            type: String, 
            required: true,
            default : "Not Assigned"    
        }
    },
    { timestamps: true }
);

const Asset = mongoose.model("Asset", assetSchema);

export default Asset;
