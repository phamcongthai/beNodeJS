const mongoose = require('mongoose')
var slug = require('mongoose-slug-updater');
const generateToken = require("../helpers/generateToken.helper");
mongoose.plugin(slug);
const Accountschema = new mongoose.Schema({
    fullName : String,
    email : String,
    password : String,
    token : {
        type : String,
        default : generateToken.generateRandomString(20)
    },
    phone: String,
    avatar: String,
    role_id : String,
    status : String,
    deleted : {
        type : Boolean,
        default : false
    },
    createBy: {
        account_id : String,
        createAt : {
            type : Date,
            default : Date.now
        }
    },
    deleteBy : {
        account_id : String,
        deleteAt:{
            type : Date,
            default : Date.now
        }
    },
    updateBy :[{
        account_id : String,
        updateAt : {
            type : Date,
            default : Date.now
        }
    }]
}, {timestamps : true});
const AccountModel = mongoose.model('Account', Accountschema, 'Account');

module.exports = AccountModel;