//services
import load_chats from '../services/load_chats.js';

import express from 'express';
const router = express.Router();

router.post('/user/loadchat', async (req,res)=>{
    const { senderid, receiverid } = req.body;
    const Latest_fifty_sortedmsgs = await load_chats(senderid, receiverid)
    res.status(201).json(Latest_fifty_sortedmsgs);
});


export default router;

