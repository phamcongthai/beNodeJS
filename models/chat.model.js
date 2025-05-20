const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    user_id : String,
    room_chat_id : String,
    content : String,
    images : Array,
    deleted : {
        type : Boolean,
        default : false
    },
    deletedAt : Date
}, {timestamps : true});// Thêm trường createAt và updateAtupdateAt
const ChatModel = mongoose.model('Chat', chatSchema, 'chat');

module.exports = ChatModel;