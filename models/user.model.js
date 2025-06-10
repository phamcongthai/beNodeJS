const mongoose = require('mongoose');
var slug = require('mongoose-slug-updater');
const generateToken = require("../helpers/generateToken.helper");

mongoose.plugin(slug);

const Userschema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  avatar: {
    type: String,
    default: ""
  },
  nickname: {
    type: String,
    default: ""
  },
  gender: {
    type: String,
    default: ""
  },
  dob: {
    day: {
      type: Number,
      min: 1,
      max: 31
    },
    month: {
      type: Number,
      min: 1,
      max: 12
    },
    year: {
      type: Number
    }
  },
  nationality: {
    type: String,
    default: ""
  },
  phone: String,
  token_user: {
    type: String,
    default: generateToken.generateRandomString(20)
  },
  status: {
    type: String,
    default: "active"
  },
  deleted: {
    type: Boolean,
    default: false
  },
  createBy: {
    account_id: String,
    createAt: {
      type: Date,
      default: Date.now
    }
  },
  deleteBy: {
    account_id: String,
    deleteAt: {
      type: Date,
      default: Date.now
    }
  },
  updateBy: [{
    account_id: String,
    updateAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

const UserModel = mongoose.model('User', Userschema, 'User');
module.exports = UserModel;
