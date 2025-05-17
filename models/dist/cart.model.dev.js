"use strict";

var mongoose = require('mongoose');

var cartSchema = new mongoose.Schema({
  user_id: String,
  products: [{
    products_id: String,
    quantity: Number
  }]
}, {
  timestamps: true
}); // Thêm trường createAt và updateAtupdateAt

var CartModel = mongoose.model('Cart', cartSchema, 'carts');
module.exports = CartModel;