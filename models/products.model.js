const mongoose = require('mongoose')
var slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const productSchema = new mongoose.Schema({
    title : String,
    description : String,
    price : Number,
    discountPercentage : Number,
    stock : Number,
    thumbnail : String,
    deleted : {
        type : Boolean,
        default : false
    },
    status : String,
    deletedTime : Date,
    position : Number,
    slug: { 
    type: String, //Kiểu slug  
    slug: "title", //Thuộc tính muốn dùng làm slug , ở đây là title
    unique: true //Là duy nhất
    }
}, {timestamps : true});
const ProductsModel = mongoose.model('Products', productSchema, 'products');

module.exports = ProductsModel;