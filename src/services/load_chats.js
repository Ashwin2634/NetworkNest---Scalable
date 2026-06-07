import messagesModel from '../db/models/messages.js';
import {redisClient} from '../../redis.js'

async function load_chats(senderid, receiverid){
    // fetch data redis / mongodb
    
    const room = await messagesModel.buildRoomId(senderid,receiverid);
    

// async function get_data(room, page=1){
    //fetch data redis (caching)
    const roomKey = `messages:room:${room}`;
    const result = await redisClient.zRangeWithScores(roomKey, 0, 49, { REV: false });
    
    if(result.length > 0){                     //check if the array has a length greater than zero
       
        let msglist=[];
        result.forEach(element => {
            const [senderId, msg] = element.value.split(':');
            const rss = {
                senderId:{_id : senderId},
                content : msg,
            };
            msglist.push(rss);
        });
        console.log(msglist);
        return msglist;
    }
    else{
        
        // fetch data from mongo db
        const msgs = await messagesModel.getConversation(room,1,50);
        
        const sortedAsc = msgs.sort((a, b) => 
            new Date(a.createdAt) - new Date(b.createdAt)
        );
        
        return sortedAsc;
        }
}

export default load_chats;