import mongoose from 'mongoose';
import User from './models/users.js';


import dotenv from 'dotenv';
dotenv.config();


async function connectDB() {
    try{
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("connected to the mongoDB database");
    }catch(err){
        console.log(`error connecting to DB, error:${err}`);
    }
}

export default connectDB;