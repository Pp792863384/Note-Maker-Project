import dotenv from 'dotenv';
dotenv.config();

let MONGO_URI= process.env.MONGO_URI;
let port = process.env.port;
let secret_token = process.env.secret_token;
export {MONGO_URI, port, secret_token};