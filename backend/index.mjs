import express from 'express';
import {mongodbURI, port, secret_token} from './config.mjs';
import mongoose from 'mongoose';
import cors from 'cors';
import router from './src/routes/route.mjs';
const app= express();
app.use(express.json());
app.use(cors());

mongoose.connect(mongodbURI).then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log("Error connecting to MongoDB:", err);
})
app.use('/', router);
app.listen(port || 8080, ()=>{
    console.log(`Server is running on port ${port}`);
})