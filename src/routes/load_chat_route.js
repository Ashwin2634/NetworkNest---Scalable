//services
import load_chats from '../services/load_chats.js';

import {redisClient} from '../../redis.js';

import messageModel from '../db/models/messages.js';

import express from 'express';
const router = express.Router();

router.post('/user/loadchat', async (req,res)=>{
    const { senderid, receiverid } = req.body;

    const roomid =messageModel.buildRoomId(senderid,receiverid);
    const key = `user:unreadCounts:${senderid}`;
    const uUnread = await redisClient.hGet(key, roomid);
    await redisClient.hSet(key, roomid, '0');

    const Latest_fifty_sortedmsgs = await load_chats(senderid, receiverid)
    const data= {chats:Latest_fifty_sortedmsgs,
        UnreadCounts:uUnread
    }
    res.status(201).json(data);
});


export default router;

