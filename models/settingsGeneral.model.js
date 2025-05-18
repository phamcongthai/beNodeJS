const mongoose = require('mongoose')

const settingsGeneralSchema = new mongoose.Schema({
    websiteName : String,
    logo : String,
    phone : String,
    email : String,
    address : String,
    copyright: String
}, {timestamps : true});// Thêm trường createAt và updateAtupdateAt
const settingsGeneralModel = mongoose.model('settingsGeneral', settingsGeneralSchema, 'settingsGeneral');

module.exports = settingsGeneralModel;