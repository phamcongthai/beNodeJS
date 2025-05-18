const mongoose = require('mongoose')
var slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const productCategorychema = new mongoose.Schema({
    title : String,
    parent_id : {
        type : String,
        default : ""
    },
    description : String,
    thumbnail : String,
    position : Number,
    status : String,
    slug: { 
    type: String, //Kiểu slug  
    slug: "title", //Thuộc tính muốn dùng làm slug , ở đây là title
    unique: true //Là duy nhất
    },
    deleted : {
        type : Boolean,
        default : false
    },
}, {timestamps : true});
const ProductsCategoryModel = mongoose.model('ProductsCategory', productCategorychema, 'products-category');

module.exports = ProductsCategoryModel;