import messagesModel from '../db/models/messages.js';


async function load_chats(senderid, receiverid){
    // fetch data from db
    
    const room = await messagesModel.buildRoomId(senderid,receiverid);
    console.log(room);
    
    const msgs = await messagesModel.getConversation(room,1,50);
    const sortedAsc = msgs.sort((a, b) => 
        new Date(a.createdAt) - new Date(b.createdAt)
    );

    return sortedAsc;
}

export default load_chats;