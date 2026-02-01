import dotenv from 'dotenv';
dotenv.config();

let mongodbURI= process.env.mongodb;
let port = process.env.port;
let secret_token = process.env.secret_token;
export {mongodbURI, port, secret_token};