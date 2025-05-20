"use strict";

var mongoose = require('mongoose');

var chatSchema = new mongoose.Schema({
  user_id: String,
  room_chat_id: String,
  content: String,
  images: Array,
  deleted: {
    type: Boolean,
    "default": false
  },
  deletedAt: Date
}, {
  timestamps: true
}); // Thêm trường createAt và updateAtupdateAt

var ChatModel = mongoose.model('Chat', chatSchema, 'chat');
module.exports = ChatModel;