//Not in USE __---------

import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
},{timestamps:true});

const User = mongoose.model("Admin",adminSchema);

export default User;
