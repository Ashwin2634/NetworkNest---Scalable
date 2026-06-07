import mongoose from 'mongoose';
import Messages from '../db/models/messages.js';
import {redisClient} from '../../redis.js'


//      const sid = currUser.dataset.userrid;
//      const rid = receiverUser.dataset.ruserrid;
//      const emitmsg ={
//                receiveriid: rid,
//                context: msginp.value,
//                senderiid: sid
//              }



async function fn (data){
    
    const room = Messages.buildRoomId(data.senderiid, data.receiveriid);
    
    // writing to redis
    const key =`messages:room:${room}`;
    const membr = `${data.senderiid}:${data.context}`;
    await redisClient.zAdd(key,{score:Date.now(),value:membr});
    
    
    
    // writing to mongodb
    try{
       
        const sid = new mongoose.Types.ObjectId(data.senderiid);
        const rid = new mongoose.Types.ObjectId(data.receiveriid);
       
        const message = await Messages.create({
            senderId:sid,
            receiverId:rid,
            roomId:room,
            content:data.context,
            type:'text'
        });
       
        
    }catch(err){
        console.log(`error saving the msg, err - ${err}`);
    }
};


export default fn;

