import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
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
        required:true
    },
    role:{
        type:String,
        enum:{
        values:['admin','user','guest'],
        msg:"Role must be admin, user, or guest"},
        required:true,   
    },
    phone:{
        type:String,
        required:true
    }
},{timestamps:true});

export default mongoose.model('User', userSchema);