"use strict";

var mongoose = require('mongoose');

var slug = require('mongoose-slug-updater');

var _require = require('../controllers/admin/accounts.controller'),
    account = _require.account;

mongoose.plugin(slug);
var productSchema = new mongoose.Schema({
  title: String,
  category_id: {
    type: String,
    "default": ""
  },
  description: String,
  price: Number,
  discountPercentage: Number,
  stock: Number,
  thumbnail: [String],
  deleted: {
    type: Boolean,
    "default": false
  },
  status: String,
  deletedTime: Date,
  position: Number,
  slug: {
    type: String,
    //Kiểu slug  
    slug: "title",
    //Thuộc tính muốn dùng làm slug , ở đây là title
    unique: true //Là duy nhất

  },
  isFeatured: Boolean,
  createBy: {
    account_id: String,
    createAt: {
      type: Date,
      "default": Date.now
    }
  },
  deleteBy: {
    account_id: String,
    deleteAt: {
      type: Date,
      "default": Date.now
    }
  },
  updateBy: [{
    account_id: String,
    updateAt: {
      type: Date,
      "default": Date.now
    }
  }],
  brand_id: String,
  tags: [String]
}, {
  timestamps: true
});
var ProductsModel = mongoose.model('Products', productSchema, 'products');
module.exports = ProductsModel;