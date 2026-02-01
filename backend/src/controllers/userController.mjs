import userModel from '../models/userModel.mjs'; 
import bcrypt from 'bcrypt';   
import jwt from 'jsonwebtoken';
import {secret_token} from '../../config.mjs';

const registerUser = async (req, res)=>{
    try {
        let {name, email, password, role, phone} = req.body;
        // console.log(req.body);
        if(!name ){
           return res.status(400).send({status:"failed", message:"Name is required"});
        }
         if(!email ){
           return res.status(400).send({status:"failed", message:"Email is required or can not duplicate"});
        }
         if(!password ){
           return res.status(400).send({status:"failed", message:"Password is required"});
        }
         if(!role ){
           return res.status(400).send({status:"failed", message:"Role is required"});
        }
         if(!phone ){
           return res.status(400).send({status:"failed", message:"Phone is required"});
        }
       
         password = await bcrypt.hash(password, 10);
        // console.log(password);
            
         const createdUser = await userModel.create({name, email, password, role, phone});
         res .status(201).send({status:"success", message:"User registered successfully"});
        
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

const loginUser =async (req, res)=>{
    try {
        const {email, password} =req.body;
        const user = await userModel.findOne({email:email});
        if(!user){
            return res.status(404).send({status:"failed", message:"User not found"});
        }
        let hashcode = user.password;
        // console.log(hashcode);
        const isMatch = await bcrypt.compare(password, hashcode);
        // console.log(isMatch);
        if(!isMatch){
            return res.status(401).send({status:"failed", message:"Invalid credentials"});
        }
        let token = jwt.sign({userId:user._id, role:user.role}, secret_token, {expiresIn:'24h'});
        if(!token){
            return res.status(500).send({status:"failed", message:"Token genration failed, try again after some time"});
        }
        // req.header.setHeader('authorization',token);
        let data ={name:user.name, email:user.email, role:user.role, phone:user.phone, token:token, id:user._id};
        return res.status(200).send({status:"success", data:data});
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

const updateUser = async (req, res)=>{
    try{
    const {email, name}= req.body;
    const updatedData = await userModel.updateOne({email:email},{$set:{name:name}});
    return res.send({status:"Ok", data:updatedData});
    }
    catch(error){

        return res.send({status:"failed", message:error.message });
    }
}
const getProfile = async (req, res) => {
    try {
        const requestedId = req.params.id;
        const loggedInUserId = req.user.userId?.toString?.() ?? String(req.user.userId);
        const requestedIdStr = String(requestedId);
        if (requestedIdStr !== loggedInUserId) {
            return res.status(403).send({ status: "failed", message: "You can only view your own profile" });
        }
        const user = await userModel.findById(requestedId).select('-password');
        if (!user) {
            return res.status(404).send({ status: "failed", message: "User not found" });
        }
        return res.status(200).send({ status: "success", data: user });
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
};

export {registerUser, loginUser, updateUser, getProfile };