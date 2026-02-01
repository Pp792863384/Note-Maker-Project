import jwt from 'jsonwebtoken';
import {secret_token} from '../../config.mjs';
import userModel from '../models/userModel.mjs';


const authentication = async (req, res, next)=>{
    try {
        const header = req.headers;
        const token = header.authorization && header.authorization.split(" ")[1] || null;
        // console.log(token);
        if(!token){
            return res.status(400).send({status:"failed", message: "Please login to continue"});
        }
        jwt.verify(token, secret_token, (err, decoded)=>{
            if(err){
                return res.status(401).send({status:"failed", message:"unathurized access/ Invalid token"});
            }
            
            else{
                req.user = decoded;
                // console.log(decoded);
                req.token = token;
                next();
            }
        });
        
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

const authorization = async (req, res, next)=>{
    try {
        // const token = req.token;
        const userId = req.user.userId;
        const user = await userModel.findById(userId);
        if(user.role ==='admin'){
            req.loggedInUser = user;
            next();
        }
        else{
            return res.status(403).send({status:"failed", message:"You are not authorized to perform this action"});
        }
        // console.log(token);
        
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

export {authentication, authorization};