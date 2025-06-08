"use strict";

var mongoose = require('mongoose');

var slug = require('mongoose-slug-updater');

mongoose.plugin(slug); // Kích hoạt plugin slug

var blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    // Kiểu slug
    slug: "title",
    // Thuộc tính muốn dùng làm slug, ở đây là title
    unique: true // Slug phải là duy nhất

  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String
  },
  tags: [String],
  category: {
    type: String
  },
  status: {
    type: String,
    "enum": ['pending', 'published'],
    "default": 'pending'
  },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId
    }
  },
  createdAt: {
    type: Date,
    "default": Date.now
  },
  updatedAt: {
    type: Date,
    "default": Date.now
  },
  deleted: {
    type: Boolean,
    "default": false
  }
}, {
  timestamps: true // Thêm createdAt và updatedAt tự động

});
var BlogModel = mongoose.model('Blog', blogSchema, 'blogs');
module.exports = BlogModel;