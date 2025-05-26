const mongoose = require('mongoose')

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    logo: {
        type: String,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    createBy: {
        account_id: String,
        createAt: {
            type: Date,
            default: Date.now
        }
    },
    deleted : {
        type : Boolean,
        default : false
    }
}, {
    timestamps: true
});

const BrandModel = mongoose.model('Brand', brandSchema, 'brands');

module.exports = BrandModel;