const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    user_id : String,
    products : [
        {
            products_id : String,
            quantity : Number
        }
    ]
}, {timestamps : true});// Thêm trường createAt và updateAtupdateAt
const CartModel = mongoose.model('Cart', cartSchema, 'carts');

module.exports = CartModel;