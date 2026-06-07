import express from 'express';
import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
const router = express.Router();

import User from'../db/models/users.js';


router.post('/api/Signup',async (req,res)=>{

    const {userName,password} = req.body;
    
    const user = await User.findOne({userName: userName.trim()});
    
    if(!user){
        
        const uid = nanoid()
        const Udata = {
            userId:uid,
            userName:userName,
            password:password
            
        };
        
        // save the user
        try {
            
            const user = new User(Udata);
            
            await user.save();
           
            return res.status(201).send(`success,,, ${userName}, you are registered!!`);
            
        } catch (err) {

            throw new Error(`Create failed: ${err.message}`);
        
        }

    }
    else{
        console.log("we some whare");
        throw new Error(`Create failed already exist`);
    }


});


export default router;