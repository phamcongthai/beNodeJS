const mongoose = require('mongoose');
var slug = require('mongoose-slug-updater');
const {
    account
} = require('../controllers/admin/accounts.controller');
mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
    title: String,
    category_id: {
        type: String,
        default: ""
    },
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: [String],
    deleted: {
        type: Boolean,
        default: false
    },
    status: String,
    deletedTime: Date,
    position: Number,
    slug: {
        type: String, // Kiểu slug  
        slug: "title", // Thuộc tính muốn dùng làm slug, ở đây là title
        unique: true // Là duy nhất
    },
    isFeatured: Boolean,
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
    }],
    brand_id: String,
    tags: [String],
    comments: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true
        },
        user_id: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            // Chỉ bắt buộc nếu là comment gốc
            required: function () {
                return this.parent_id === null;
            }
        },
        parent_id: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },
        create_at: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

const ProductsModel = mongoose.model('Products', productSchema, 'products');

module.exports = ProductsModel;