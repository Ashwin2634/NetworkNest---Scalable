import mongoose from 'mongoose';
import User from './users.js';

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      index: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      index: true,
    },
    // Derived room key — always sorted so "A↔B" and "B↔A" share the same room
    roomId: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      maxlength: [4000, 'Message too long'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['text', 'image', 'file'],
      default: 'text',
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Compound index for efficient conversation queries
messageSchema.index({ roomId: 1, createdAt: -1 });



messageSchema.statics.buildRoomId = function (senderId,receiverId){
    return [senderId.toString(),receiverId.toString()].sort().join('_');
};

messageSchema.statics.getConversation = function (roomid,page = 1,limit = 50){
    const skip = (page - 1) * limit ;
    return this.find({roomId:roomid})
        .sort({createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('senderId', 'userName')
        .populate('receiverId', 'userName');
        
};


const Messages = mongoose.model('message',messageSchema);

export default Messages;