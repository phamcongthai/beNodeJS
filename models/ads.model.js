const mongoose = require('mongoose');

const adsSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    targetUrl: {
        type: String,
    },
    position: {
        type: String, // ví dụ: "homepage", "sidebar", ...
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    createBy: {
        account_id: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const AdsModel = mongoose.model('Ads', adsSchema, 'ads');

module.exports = AdsModel;
