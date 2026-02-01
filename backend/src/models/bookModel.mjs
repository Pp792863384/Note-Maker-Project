import mongoose from "mongoose";
const bookSchema = new mongoose.Schema({
    name:String,
    auther:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
}, {timestamps:true});
export default mongoose.model('book', bookSchema);