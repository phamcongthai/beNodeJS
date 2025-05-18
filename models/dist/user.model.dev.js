"use strict";

var _ref;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var mongoose = require('mongoose');

var slug = require('mongoose-slug-updater');

var generateToken = require("../helpers/generateToken.helper");

mongoose.plugin(slug);
var Userschema = new mongoose.Schema((_ref = {
  fullName: String,
  email: String,
  password: String,
  avatar: {
    type: String,
    "default": ""
  },
  token_user: {
    type: String,
    "default": generateToken.generateRandomString(20)
  },
  phone: String
}, _defineProperty(_ref, "avatar", String), _defineProperty(_ref, "status", {
  type: String,
  "default": "active"
}), _defineProperty(_ref, "deleted", {
  type: Boolean,
  "default": false
}), _defineProperty(_ref, "createBy", {
  account_id: String,
  createAt: {
    type: Date,
    "default": Date.now
  }
}), _defineProperty(_ref, "deleteBy", {
  account_id: String,
  deleteAt: {
    type: Date,
    "default": Date.now
  }
}), _defineProperty(_ref, "updateBy", [{
  account_id: String,
  updateAt: {
    type: Date,
    "default": Date.now
  }
}]), _ref), {
  timestamps: true
});
var UserModel = mongoose.model('User', Userschema, 'User');
module.exports = UserModel;