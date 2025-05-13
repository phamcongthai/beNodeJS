const mongoose = require('mongoose')

const rolesSchema = new mongoose.Schema({
    title : String,
    description : String,
    permissions: {
        type : Array,
        default : []
    },
    deleted : {
        type : Boolean,
        default : false
    },
    deletedAt : Date
}, {timestamps : true});// Thêm trường createAt và updateAtupdateAt
const RolesModel = mongoose.model('Roles', rolesSchema, 'roles');

module.exports = RolesModel;