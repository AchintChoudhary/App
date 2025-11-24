
import Conversation from '../models/conversation.model.js'
import Message from '../models/message.model.js'
import { getReceiverSocketId,io } from '../socket/socket.js';
export const sendMessage=async(req,res)=>{
    try{
const {message}=req.body;
const {id:receiverId}=req.params;
const senderId=req.user._id;

let chats=await Conversation.findOne({
participants:{$all:[senderId,receiverId]}
})

if(!chats){
    chats=await Conversation.create({
        participants:[senderId,receiverId]
    })
}

const newMessages=new Message({
senderId,
receiverId,
message,
conversationId:chats._id
}) 

if(newMessages){
    chats.messages.push(newMessages._id)
}

//Socket IO function
await Promise.all([chats.save(),newMessages.save()])

const receiverSocketId=getReceiverSocketId(receiverId)
if(receiverId){
    io.to(receiverSocketId).emit('newMesssage',newMessages)
}



res.status(201).send(newMessages)
}catch(error){
res.status(500).send({
    success:false,
    message:error.message
})
    }
}



export const receieveMessage=async(req,res)=>{
    try {
        
const {id:receiverId}=req.params;
const senderId=req.user._id;

const chats=await Conversation.findOne({
    participants:{$all:[senderId,receiverId]}
}).populate("messages")

if(!chats){
    return res.status(200).send([]);
}
const message=chats.messages;


res.status(200).send(message)
    } catch (error) {
        res.status(500).send({
    success:false,
    message:error.message
})
    }
}

