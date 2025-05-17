"use strict";

var mongoose = require('mongoose');

var forgotPassSchema = new mongoose.Schema({
  email: String,
  opt: String,
  expireAt: {
    type: Date,
    "default": function _default() {
      return new Date(Date.now() + 1000 * 60 * 3);
    },
    // Sau 3 phút
    expires: 0 // TTL xóa sau khi đạt tới expireAt

  }
}, {
  timestamps: true
}); // Thêm createdAt và updatedAt

var forgotPassModel = mongoose.model('forgotPass', forgotPassSchema, 'forgotPass');
module.exports = forgotPassModel;