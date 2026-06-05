import express from 'express';
import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
const router = express.Router();

import User from'../db/models/users.js';


router.post('/api/Signup',async (req,res)=>{

    const {userName,password} = req.body;
    console.log('------herer ----');
    const user = await User.findOne({userName: userName.trim()});
    console.log('----0000000--herer ----');
    if(!user){
        console.log('------herer 1111111----');
        const uid = nanoid()
        const Udata = {
            userId:uid,
            userName:userName,
            password:password
            
        };
        
        // save the user
        try {
            console.log('----1--herer ----');
            const user = new User(Udata);
            console.log('----10101010--herer ----');
            await user.save();
            console.log('---9999999999---herer ----');
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