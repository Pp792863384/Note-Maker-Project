import bookModel from "../models/bookModel.mjs";
const createBook = async (req, res)=>{
    try {
        const data = req.body;
        const book = await bookModel.create(data);
        return res.status(201).send({status:"success", message:"Book created successfully", data:book});
    } catch (error) {
         if(error.message.includes("validation")){
            return res.status(400).send({status:"failed", message:error.message});
        }
        else if(error.message.includes("duplicate")){
            return res.status(409).send({status:"failed", message:"User already exists"});
        }
        else{
            return res.status(500).send({status:"failed", message:"Internal server error"});
        }
        
    }
}

const getBook = async (req, res)=>{
    try {
        const data = req.body;
        const books = await bookModel.find().populate('auther');
        return res.status(200).send({status:"success", message:"Books fetched successfully", data:books});
    }catch (error) {
    return res.status(500).send({status:"failed", message:"Internal server error"});
}

}
export {createBook, getBook};